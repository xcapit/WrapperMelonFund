import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';

export interface InvestmentRequestStatusVariables {
  fund: string;
  account?: string;
}

const InvestmentRequestStatusQuery = gql`
  query useFundInvestQuery($account: Address!, $fund: Address!) {
    account(address: $account) {
      participation(address: $fund) {
        address
        investmentRequestState
        canCancelRequest
        hasExpiredRequest
        hasValidRequest
      }
    }
  }
`;

export const useInvestmentRequestStatusQuery = (account: string, fund: string) => {
  const options = {
    variables: { account, fund },
  };

  const result = useOnChainQuery<InvestmentRequestStatusVariables>(InvestmentRequestStatusQuery, options);

  const participation = result.data?.account?.participation;

  return [participation, result] as [typeof participation, typeof result];
};
