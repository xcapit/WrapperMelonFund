import BigNumber from 'bignumber.js';
import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';

export interface AccountAllowance {
  allowance: BigNumber;
  balance: BigNumber;
}

const AccountAllowanceQuery = gql`
  query AccountBalancesQuery($account: Address!, $spender: Address!, $token: String!) {
    account(address: $account) {
      balance(token: $token)
      allowance(token: $token, spender: $spender)
    }
  }
`;

export const useAccountAllowanceQuery = (account?: string, token?: string, spender?: string) => {
  const result = useOnChainQuery(AccountAllowanceQuery, {
    variables: {
      token,
      spender,
      account,
    },
    skip: !(token && spender && account),
  });

  return [result.data && result.data.account, result] as [AccountAllowance, typeof result];
};
