import BigNumber from 'bignumber.js';
import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';

export interface AccountContext {
  fund?: string;
  eth?: BigNumber;
  weth?: BigNumber;
}

export interface AccountContextQueryVariables {
  address?: string;
}

const AccountContextQuery = gql`
  query AccountContextQuery($address: Address!) {
    account(address: $address) {
      eth: balance(token: ETH)
      weth: balance(token: WETH)
      fund {
        address
      }
    }
  }
`;

export const useAccountContextQuery = (address?: string) => {
  const result = useOnChainQuery<AccountContextQueryVariables>(AccountContextQuery, {
    skip: !address,
    variables: { address },
  });

  const account = result.data?.account;

  const output: AccountContext = {
    fund: account?.fund?.address,
    eth: (account as any)?.eth as BigNumber,
    weth: (account as any)?.weth as BigNumber,
  };

  return [output, result] as [typeof output, typeof result];
};
