import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';
import { useAccount } from '~/hooks/useAccount';

export interface FundInvestQueryVariables {
  fund: string;
  account?: string;
}

const FundRedeemQuery = gql`
  query FundRedeemQuery($account: Address!, $fund: Address!) {
    account(address: $account) {
      participation(address: $fund) {
        address
        investmentRequestState
        canCancelRequest
      }
      shares(address: $fund) {
        address
        balanceOf
      }
    }
    fund(address: $fund) {
      routes {
        trading {
          lockedAssets {
            address
          }
        }
      }
    }
  }
`;

export const useFundRedeemQuery = (fund: string) => {
  const account = useAccount();
  const options = {
    skip: !account.address,
    variables: { fund, account: account.address },
  };

  const result = useOnChainQuery<FundInvestQueryVariables>(FundRedeemQuery, options);
  return [result.data, result] as [typeof result.data, typeof result];
};
