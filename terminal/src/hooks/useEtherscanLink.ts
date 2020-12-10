import { useMemo } from 'react';
import { useEnvironment } from './useEnvironment';
import { NetworkEnum } from '~/types';

export interface UseEtherscanLinkProps {
  address?: string;
  hash?: string;
}

export const useEtherscanLink = ({ address, hash }: UseEtherscanLinkProps) => {
  const environment = useEnvironment();
  const network = (environment?.network as any) as NetworkEnum | undefined;

  const url = useMemo(() => {
    if (!address && !hash) {
      return null;
    }

    const link = address ? `address/${address}` : `tx/${hash}`;

    if (network === NetworkEnum.MAINNET) {
      return `https://etherscan.io/${link}`;
    }

    if (network === NetworkEnum.KOVAN) {
      return `https://kovan.etherscan.io/${link}`;
    }

    if (network === NetworkEnum.RINKEBY) {
      return `https://rinkeby.etherscan.io/${link}`;
    }

    return null;
  }, [address, hash]);

  return url;
};
