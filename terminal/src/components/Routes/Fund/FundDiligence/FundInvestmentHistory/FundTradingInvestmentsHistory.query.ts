import gql from 'graphql-tag';
import BigNumber from 'bignumber.js';
import { useTheGraphQuery } from '~/hooks/useQuery';

export interface FundInvestmentHistory {
  id: string;
  amountInDenominationAsset: BigNumber;
  asset: {
    symbol: string;
    decimals: number;
  };
  owner: {
    id: string;
  };
  timestamp: number;
  action: string;
  shares: BigNumber;
  sharePrice: BigNumber;
  amount: BigNumber;
}

export interface FundDetailsQueryResult {
  fund: {
    investmentHistory: FundInvestmentHistory[];
  };
}

export interface FundInvestmentHistoryQueryVariables {
  address: string;
}

const FundInvestmentHistoryQuery = gql`
  query FundDetailsQuery($address: ID!) {
    fund(id: $address) {
      investmentHistory(orderBy: timestamp, where: { action_not: "Fee allocation" }) {
        id
        asset {
          symbol
          decimals
        }
        amountInDenominationAsset
        timestamp
        action
        owner {
          id
        }
        shares
        sharePrice
        amount
      }
    }
  }
`;

export const useFundInvestmentHistory = (address: string) => {
  const options = {
    variables: { address: address?.toLowerCase() },
  };

  const result = useTheGraphQuery<FundDetailsQueryResult, FundInvestmentHistoryQueryVariables>(
    FundInvestmentHistoryQuery,
    options
  );

  return [result.data && result.data.fund && result.data.fund.investmentHistory, result] as [
    FundInvestmentHistory[] | undefined,
    typeof result
  ];
};
