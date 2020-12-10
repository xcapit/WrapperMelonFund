import gql from 'graphql-tag';
import { useTheGraphQuery } from '~/hooks/useQuery';
import BigNumber from 'bignumber.js';

export interface CalculationsHistory {
  id: string;
  gav: BigNumber;
  nav: BigNumber;
  totalSupply: BigNumber;
  feesInDenominationAsset: BigNumber;
  sharePrice: BigNumber;
  timestamp: BigNumber;
}

export interface FundCalculationHistoryQueryResult {
  fundCalculationsHistories: CalculationsHistory[];
}

export interface FundTradingHistoryQueryVariables {
  address: string;
  // add an optional timestamp value
}

const FundCalculationHistoryQuery = gql`
  query FundCalculationHistoryQuery($address: String!) {
    fundCalculationsHistories(where: { fund: $address }, orderBy: timestamp, first: 1000) {
      id
      gav
      nav
      totalSupply
      feesInDenominationAsset
      sharePrice
      timestamp
    }
  }
`;

export const useFundCalculationHistoryQuery = (address: string) => {
  const options = {
    variables: { address: address?.toLowerCase() },
  };

  const result = useTheGraphQuery<FundCalculationHistoryQueryResult, FundTradingHistoryQueryVariables>(
    FundCalculationHistoryQuery,
    options
  );

  const fundCalculationsHistories = result.data?.fundCalculationsHistories ?? [];
  return [fundCalculationsHistories, result] as [typeof fundCalculationsHistories, typeof result];
};
