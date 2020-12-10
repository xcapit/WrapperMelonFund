const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { addReactRefresh } = require('customize-cra-react-refresh');
const {
  override,
  addBabelPlugin,
  disableEsLint,
  addWebpackPlugin,
  addWebpackModuleRule,
  addWebpackAlias,
  removeModuleScopePlugin,
} = require('customize-cra');

const mainnet = validateDeployment('MAINNET');
const kovan = validateDeployment('KOVAN');
const rinkeby = validateDeployment('RINKEBY');
const testnet = process.env.NODE_ENV === 'development' && validateGanache();

const mainnetDeploymentAlias = mainnet && deploymentAlias(process.env.MELON_MAINNET_DEPLOYMENT);
const kovanDeploymentAlias = kovan && deploymentAlias(process.env.MELON_KOVAN_DEPLOYMENT);
const rinkebyDeploymentAlias = rinkeby && deploymentAlias(process.env.MELON_RINKEBY_DEPLOYMENT);
const testnetDeploymentAlias = testnet && deploymentAlias(process.env.MELON_TESTNET_DEPLOYMENT);
const testnetAccountsAlias = testnet && deploymentAlias(process.env.MELON_TESTNET_ACCOUNTS);

const root = path.resolve(__dirname, 'src');
const empty = path.join(root, 'utils', 'emptyImport');

if (!mainnet && !kovan && !rinkeby && !testnet) {
  throw new Error('You have to provide at least one deployment. Supported networks: MAINNET, KOVAN, RINKEBY, TESTNET.');
}

module.exports = override(
  // TODO: Consider disabling error overlay: https://github.com/pmmmwh/react-refresh-webpack-plugin/pull/33
  addReactRefresh({ disableRefreshCheck: true }),
  disableEsLint(),
  removeModuleScopePlugin(),
  addBabelPlugin(['styled-components', { ssr: false, displayName: true }]),
  addBabelPlugin('@babel/proposal-optional-chaining'),
  addBabelPlugin('@babel/proposal-nullish-coalescing-operator'),
  addWebpackAlias({
    'deployments/mainnet-deployment': mainnetDeploymentAlias || empty,
    'deployments/kovan-deployment': kovanDeploymentAlias || empty,
    'deployments/rinkeby-deployment': rinkebyDeploymentAlias || empty,
    'deployments/testnet-deployment': testnetDeploymentAlias || empty,
    'deployments/testnet-accounts': testnetAccountsAlias || empty,
  }),
  addWebpackAlias(pathAliases()),
  addWebpackPlugin(new webpack.IgnorePlugin(/^scrypt$/)),
  addWebpackPlugin(
    new webpack.ContextReplacementPlugin(/graphql-language-service-interface[\\/]dist$/, new RegExp(`^\\./.*\\.js$`))
  ),
  addWebpackPlugin(
    new webpack.ContextReplacementPlugin(/graphql-language-service-utils[\\/]dist$/, new RegExp(`^\\./.*\\.js$`))
  ),
  addWebpackPlugin(
    new webpack.ContextReplacementPlugin(/graphql-language-service-parser[\\/]dist$/, new RegExp(`^\\./.*\\.js$`))
  ),
  addWebpackPlugin(
    new webpack.DefinePlugin({
      'process.env.MELON_MAX_EXPOSURE': JSON.stringify(process.env.MELON_MAX_EXPOSURE),
      'process.env.MELON_API_GATEWAY': JSON.stringify(process.env.MELON_API_GATEWAY),
      'process.env.MELON_FORTMATIC_KEY': JSON.stringify(process.env.MELON_FORTMATIC_KEY),
      'process.env.MELON_TELEGRAM_API': JSON.stringify(process.env.MELON_TELEGRAM_API),
      'process.env.MELON_RATES_API': JSON.stringify(process.env.MELON_RATES_API),
      'process.env.MELON_METRICS_API': JSON.stringify(process.env.MELON_METRICS_API),
      'process.env.MELON_KYC_VERIFY_EMAIL_API': JSON.stringify(process.env.MELON_KYC_VERIFY_EMAIL_API),
      'process.env.MELON_KYC_FUNDS': JSON.stringify(process.env.MELON_KYC_FUNDS),
      'process.env.MELON_WALLETCONNECT_INFURA_ID': JSON.stringify(process.env.MELON_WALLETCONNECT_INFURA_ID),
      'process.env.MELON_INCLUDE_GRAPHIQL': JSON.stringify(process.env.MELON_INCLUDE_GRAPHIQL),
      'process.env.MELON_MAINNET': JSON.stringify(mainnet),
      'process.env.MELON_KOVAN': JSON.stringify(kovan),
      'process.env.MELON_RINKEBY': JSON.stringify(rinkeby),
      'process.env.MELON_TESTNET': JSON.stringify(testnet),
      ...(mainnet && {
        'process.env.MELON_MAINNET_SUBGRAPH': JSON.stringify(process.env.MELON_MAINNET_SUBGRAPH),
        'process.env.MELON_MAINNET_PROVIDER': JSON.stringify(process.env.MELON_MAINNET_PROVIDER),
        ...(!mainnetDeploymentAlias && {
          'process.env.MELON_MAINNET_DEPLOYMENT': JSON.stringify(process.env.MELON_MAINNET_DEPLOYMENT),
        }),
      }),
      ...(rinkeby && {
        'process.env.MELON_RINKEBY_SUBGRAPH': JSON.stringify(process.env.MELON_RINKEBY_SUBGRAPH),
        'process.env.MELON_RINKEBY_PROVIDER': JSON.stringify(process.env.MELON_RINKEBY_PROVIDER),
        ...(!rinkebyDeploymentAlias && {
          'process.env.MELON_RINKEBY_DEPLOYMENT': JSON.stringify(process.env.MELON_RINKEBY_DEPLOYMENT),
        }),
      }),
      ...(kovan && {
        'process.env.MELON_KOVAN_SUBGRAPH': JSON.stringify(process.env.MELON_KOVAN_SUBGRAPH),
        'process.env.MELON_KOVAN_PROVIDER': JSON.stringify(process.env.MELON_KOVAN_PROVIDER),
        ...(!kovanDeploymentAlias && {
          'process.env.MELON_KOVAN_DEPLOYMENT': JSON.stringify(process.env.MELON_KOVAN_DEPLOYMENT),
        }),
      }),
      ...(testnet && {
        'process.env.MELON_TESTNET_SUBGRAPH': JSON.stringify(process.env.MELON_TESTNET_SUBGRAPH),
        'process.env.MELON_TESTNET_PROVIDER': JSON.stringify(process.env.MELON_TESTNET_PROVIDER),
        ...(!testnetDeploymentAlias && {
          'process.env.MELON_TESTNET_DEPLOYMENT': JSON.stringify(process.env.MELON_TESTNET_DEPLOYMENT),
        }),
      }),
    })
  ),
  addWebpackModuleRule({
    test: /\.(graphql|gql)$/,
    include: path.resolve(__dirname, 'src'),
    exclude: /node_modules/,
    loader: 'graphql-tag/loader',
  })
);

function pathAliases() {
  const { paths, baseUrl } = require('./paths.json').compilerOptions;
  const aliases = Object.keys(paths).reduce((carry, current) => {
    const key = current.replace('/*', '');
    const value = path.resolve(baseUrl, paths[current][0].replace('/*', '').replace('*', ''));
    return { ...carry, [key]: value };
  }, {});

  return aliases;
}

function deploymentAlias(env) {
  const deploymentFile = path.resolve(env);
  if (fs.existsSync(deploymentFile)) {
    JSON.parse(fs.readFileSync(deploymentFile), 'utf8');
    return deploymentFile;
  }

  return undefined;
}

function validateDeployment(name) {
  const deployment = process.env[`MELON_${name}_DEPLOYMENT`];
  if (!deployment) {
    return false;
  }

  const subgraph = process.env[`MELON_${name}_SUBGRAPH`];
  if (!subgraph) {
    return false;
  }

  if (deployment.startsWith('http://') || deployment.startsWith('https://')) {
    return true;
  }

  try {
    JSON.parse(deployment);
    return true;
  } catch (e) {
    // Nothing to do here.
  }

  try {
    const deploymentPath = path.resolve(deployment);
    if (fs.existsSync(deploymentPath)) {
      JSON.parse(fs.readFileSync(deploymentPath), 'utf8');
      return true;
    }
  } catch (e) {
    // Nothing to do here.
  }

  throw new Error(`Failed to load ${name} deployment.`);
}

function validateGanache() {
  if (!validateDeployment('TESTNET')) {
    return false;
  }

  const provider = process.env.MELON_TESTNET_PROVIDER;
  if (!provider) {
    return false;
  }

  const accounts = process.env.MELON_TESTNET_ACCOUNTS;
  if (!accounts) {
    return false;
  }

  try {
    JSON.parse(accounts);
    return true;
  } catch (e) {
    // Nothing to do here.
  }

  try {
    const accountsPath = path.resolve(accounts);
    if (fs.existsSync(accountsPath)) {
      JSON.parse(fs.readFileSync(accountsPath), 'utf8');
      return true;
    }
  } catch (e) {
    // Nothing to do here.
  }

  throw new Error(`Failed to load ganache accounts.`);
}
