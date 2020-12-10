import { NetworkEnum } from '~/types';
import { getConfig } from '~/config';

export function networkFromName(name?: string): NetworkEnum | undefined {
  const lowercase = name?.toLowerCase();

  if (lowercase === 'mainnet' && !!getConfig(NetworkEnum.MAINNET)) {
    return NetworkEnum.MAINNET;
  }

  if (lowercase === 'rinkeby' && !!getConfig(NetworkEnum.RINKEBY)) {
    return NetworkEnum.RINKEBY;
  }

  if (lowercase === 'kovan' && !!getConfig(NetworkEnum.KOVAN)) {
    return NetworkEnum.KOVAN;
  }

  if (lowercase === 'testnet' && !!getConfig(NetworkEnum.TESTNET)) {
    return NetworkEnum.TESTNET;
  }

  return NetworkEnum.UNSUPPORTED;
}
