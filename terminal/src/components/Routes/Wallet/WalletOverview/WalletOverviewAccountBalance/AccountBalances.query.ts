import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';
import BigNumber from 'bignumber.js';

export interface AccountBalancesVariables {
  account?: string;
}

export interface TokenBalances {
  balance: BigNumber;
  symbol: string;
  name: string;
  decimals: number;
}

const AccountBalanceQuery = gql`
  query useAccountBalance($account: Address!) {
    assets {
      symbol
      name
      decimals
      balance(account: $account)
    }
  }
`;

export const useAccountBalanceQuery = (account?: string) => {
  const options = {
    variables: { account: account?.toLowerCase() },
  };

  const result = useOnChainQuery<AccountBalancesVariables>(AccountBalanceQuery, options);
  return [result.data?.assets ?? [], result] as [TokenBalances[], typeof result];
};
