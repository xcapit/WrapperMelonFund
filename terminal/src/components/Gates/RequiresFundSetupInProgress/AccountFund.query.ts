import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';
import { Maybe } from '~/types';
import { Address } from '@melonproject/melonjs';
import { useAccount } from '~/hooks/useAccount';

export interface AccountFund {
  fund: {
    address: Address;
    name: string;
    isShutDown: boolean;
    progress: string;
  };
}

interface AccountFundQueryVariables {
  account?: string;
}

const AccountFundQuery = gql`
  query AccountFundQuery($account: Address!) {
    account(address: $account) {
      fund {
        address
        name
        isShutDown
        progress
      }
    }
  }
`;

export const useAccountFundQuery = () => {
  const account = useAccount();
  const result = useOnChainQuery<AccountFundQueryVariables>(AccountFundQuery, {
    skip: !account.address,
    variables: { account: account.address },
  });

  return [result.data && result.data.account, result] as [Maybe<AccountFund>, typeof result];
};
