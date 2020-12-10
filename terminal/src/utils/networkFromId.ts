import { NetworkEnum } from '~/types';
import { getConfig } from '~/config';

export function networkFromId(id?: number): NetworkEnum | undefined {
  if (id === 1 && !!getConfig(NetworkEnum.MAINNET)) {
    return NetworkEnum.MAINNET;
  }

  if (id === 4 && !!getConfig(NetworkEnum.RINKEBY)) {
    return NetworkEnum.RINKEBY;
  }

  if (id === 42 && !!getConfig(NetworkEnum.KOVAN)) {
    return NetworkEnum.KOVAN;
  }

  if (id === 4447 && !!getConfig(NetworkEnum.TESTNET)) {
    return NetworkEnum.TESTNET;
  }

  return NetworkEnum.UNSUPPORTED;
}
