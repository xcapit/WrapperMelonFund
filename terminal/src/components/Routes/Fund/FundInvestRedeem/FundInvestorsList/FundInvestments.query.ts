import gql from 'graphql-tag';
import BigNumber from 'bignumber.js';
import { useTheGraphQuery } from '~/hooks/useQuery';

export interface FundInvestments {
  id: string;
  shares: BigNumber;
  owner: {
    id: string;
  };
}

export interface FundInvestmentsQueryResult {
  fund: {
    investments: FundInvestments[];
  };
}

export interface FundInvestmentsQueryVariables {
  address: string;
}

const FundInvestmentsQuery = gql`
  query FundDetailsQuery($address: ID!) {
    fund(id: $address) {
      name
      investments(orderBy: createdAt) {
        id
        shares
        owner {
          id
        }
      }
    }
  }
`;

export const useFundInvestments = (address: string) => {
  const options = {
    variables: { address: address?.toLowerCase() },
  };

  const result = useTheGraphQuery<FundInvestmentsQueryResult, FundInvestmentsQueryVariables>(
    FundInvestmentsQuery,
    options
  );

  return [result.data && result.data.fund && result.data.fund.investments, result] as [
    FundInvestments[] | undefined,
    typeof result
  ];
};
