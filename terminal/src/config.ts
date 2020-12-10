import { NetworkEnum } from './types';
import { DeploymentOutput, TokenDefinition, ExchangeDefinition, PolicyDefinition } from '@melonproject/melonjs';

export interface Config {
  supported: boolean;
  label: string;
  name: string;
  subgraph: string;
  provider: string;
  deployment: () => Promise<DeploymentOutput>;
  tokens?: TokenDefinition[];
  exchanges?: ExchangeDefinition[];
  policies?: PolicyDefinition[];
}

export type ConfigMap = {
  [index in NetworkEnum]?: Config;
};

export function getConfig(network?: NetworkEnum) {
  const current = (network && config[network]) || undefined;
  if (current && current.supported) {
    return current;
  }

  return undefined;
}

export function getNetworkLabel(network?: NetworkEnum) {
  const current = (network && config[network]) || undefined;
  return current?.label ?? undefined;
}

export function getNetworkName(network?: NetworkEnum) {
  const current = (network && config[network]) || undefined;
  return current?.name ?? undefined;
}

async function loadDeployment(fallback: () => Promise<any>, source?: string) {
  if (source && (source.startsWith('https://') || source.startsWith('http://'))) {
    return (await fetch(source)).json();
  }

  if (source) {
    return JSON.parse(source);
  }

  return fallback();
}

export const config: ConfigMap = {
  [NetworkEnum.MAINNET]: {
    label: 'Mainnet',
    name: 'mainnet',
    supported: !!JSON.parse(process.env.MELON_MAINNET),
    subgraph: process.env.MELON_MAINNET_SUBGRAPH,
    provider: process.env.MELON_MAINNET_PROVIDER,
    deployment: async () => {
      // @ts-ignore
      return loadDeployment(() => import('deployments/mainnet-deployment'), process.env.MELON_MAINNET_DEPLOYMENT);
    },
    tokens: [
      {
        symbol: 'DGX',
        address: '0x4f3afec4e5a3f2a6a1a411def7d7dfe50ee057bf',
        decimals: 9,
        name: 'Digix Gold Token',
        historic: true,
      },
      {
        symbol: 'ENG',
        address: '0xf0ee6b27b759c9893ce4f094b49ad28fd15a23e4',
        name: 'Enigma',
        decimals: 8,
        historic: true,
      },
      {
        symbol: 'OMG',
        address: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
        name: 'OmiseGo',
        decimals: 18,
        historic: true,
      },
      {
        symbol: 'USDT',
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        name: 'Tether USD',
        decimals: 6,
        historic: true,
      },
    ],
    exchanges: [
      {
        name: '0x (v2.0)',
        id: '0x3ecfe6f8414ed517366a5e6f7f7fc74ef21caac9',
        adapter: '0x3ecfe6f8414ed517366a5e6f7f7fc74ef21caac9',
        exchange: '0x4f833a24e1f95d70f028921e27040ca56e09ab0b',
        historic: true,
      },
      {
        name: '0x (v2.0)',
        id: '0x9312d09433fff34f7b57b02996486d54d420ea74',
        adapter: '0x9312d09433fff34f7b57b02996486d54d420ea74',
        exchange: '0x4f833a24e1f95d70f028921e27040ca56e09ab0b',
        historic: true,
      },
      {
        name: '0x (v2.0)',
        id: '0x7a81b7ed275190a12b5f2d2766c73d249fa6719b',
        adapter: '0x7a81b7ed275190a12b5f2d2766c73d249fa6719b',
        exchange: '0x4f833a24e1f95d70f028921e27040ca56e09ab0b',
        historic: true,
      },
      {
        name: '0x (v2.1)',
        id: '0x3ecfe6f8414ed517366a5e6f7f7fc74ef21caac9',
        adapter: '0x3ecfe6f8414ed517366a5e6f7f7fc74ef21caac9',
        exchange: '0x080bf510fcbf18b91105470639e9561022937712',
        historic: true,
      },
      {
        name: '0x (v2.1)',
        id: '0x03f2121b9b86db6d2e3373c3acafaf043d7c42af',
        adapter: '0x03f2121b9b86db6d2e3373c3acafaf043d7c42af',
        exchange: '0x080bf510fcbf18b91105470639e9561022937712',
        historic: true,
      },
      {
        name: '0x (v3)',
        id: '0x4132f47401c352218a10A29d1D86A4c87EADD604',
        adapter: '0x4132f47401c352218a10A29d1D86A4c87EADD604',
        exchange: '0x61935CbDd02287B511119DDb11Aeb42F1593b7Ef',
        historic: true,
      },
      {
        name: 'Kyber Network (old)',
        id: '0x8cb3e810027d97be5e890257338b9cc755de9c67',
        adapter: '0x8cb3e810027d97be5e890257338b9cc755de9c67',
        exchange: '0x818e6fecd516ecc3849daf6845e3ec868087b755',
        historic: true,
      },
      {
        name: 'Ethfinex',
        id: '0x48525a3dd8e3cd655b21340c5474402aa6247b85',
        adapter: '0x48525a3dd8e3cd655b21340c5474402aa6247b85',
        exchange: '0xdcdb42c9a256690bd153a7b409751adfc8dd5851',
        historic: true,
      },
      {
        name: 'OasisDEX (old)',
        id: '0x542f91538205fce34c7e1538b7ce2218655d8623',
        adapter: '0x542f91538205fce34c7e1538b7ce2218655d8623',
        exchange: '0x39755357759ce0d7f32dc8dc45414cca409ae24e',
        historic: true,
      },
      {
        name: 'MelonEngine (v1)',
        id: '0xf31d358efd7b80a6733bcb850bd49bfcbec1428a',
        adapter: '0xf31d358efd7b80a6733bcb850bd49bfcbec1428a',
        exchange: '0x7caec96607c5c7190d63b5a650e7ce34472352f5',
        historic: true,
      },
      {
        name: 'Uniswap',
        id: '0x3fda51d218919b96a850e7b66d412a4604e4901d',
        adapter: '0x3fda51d218919b96a850e7b66d412a4604e4901d',
        exchange: '0xc0a47dfe034b400b47bdad5fecda2621de6c4d95',
        historic: true,
      },
    ],
  },
  [NetworkEnum.KOVAN]: {
    label: 'Kovan',
    name: 'kovan',
    supported: !!JSON.parse(process.env.MELON_KOVAN),
    subgraph: process.env.MELON_KOVAN_SUBGRAPH,
    provider: process.env.MELON_KOVAN_PROVIDER,
    deployment: async () => {
      // @ts-ignore
      return loadDeployment(() => import('deployments/kovan-deployment'), process.env.MELON_KOVAN_DEPLOYMENT);
    },
  },
  [NetworkEnum.RINKEBY]: {
    label: 'Rinkeby',
    name: 'rinkeby',
    supported: !!JSON.parse(process.env.MELON_RINKEBY),
    subgraph: process.env.MELON_RINKEBY_SUBGRAPH,
    provider: process.env.MELON_RINKEBY_PROVIDER,
    deployment: async () => {
      // @ts-ignore
      return loadDeployment(() => import('deployments/rinkeby-deployment'), process.env.MELON_RINKEBY_DEPLOYMENT);
    },
  },
  [NetworkEnum.TESTNET]: {
    label: 'Testnet',
    name: 'testnet',
    supported: !!JSON.parse(process.env.MELON_TESTNET),
    subgraph: process.env.MELON_TESTNET_SUBGRAPH,
    provider: process.env.MELON_TESTNET_PROVIDER,
    deployment: async () => {
      // @ts-ignore
      return loadDeployment(() => import('deployments/testnet-deployment'), process.env.MELON_TESTNET_DEPLOYMENT);
    },
  },
};
