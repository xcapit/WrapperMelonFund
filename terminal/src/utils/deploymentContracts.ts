import { KyberPriceFeed, Version, DeployedEnvironment } from '@melonproject/melonjs';

export function priceFeedContract(environment: DeployedEnvironment) {
  const addresses = environment.deployment.melon.addr;
  if (addresses.TestingPriceFeed) {
    return new KyberPriceFeed(environment, addresses.TestingPriceFeed);
  }

  if (addresses.KyberPriceFeed) {
    return new KyberPriceFeed(environment, addresses.KyberPriceFeed);
  }

  throw new Error('Missing price feed address');
}

export function versionContract(environment: DeployedEnvironment) {
  return new Version(environment, environment.deployment.melon.addr.Version);
}
