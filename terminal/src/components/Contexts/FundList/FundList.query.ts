import BigNumber from 'bignumber.js';
import gql from 'graphql-tag';
import { useTokenRates } from '~/components/Contexts/Rates/Rates';
import { useTheGraphQuery } from '~/hooks/useQuery';
import { calculateChangeFromSharePrice } from '~/utils/calculateChangeFromSharePrice';

export interface SharePrice {
  sharePrice: string;
}

export interface Fund {
  id: string;
  name: string;
  gav: BigNumber;
  sharePrice: BigNumber;
  totalSupply: BigNumber;
  isShutdown: boolean;
  createdAt: number;
  investments: [
    {
      id: string;
    }
  ];
  version: {
    id: string;
    name: string;
  };
  accounting: {
    id: string;
    denominationAsset: {
      id: string;
      symbol: string;
    };
  };
  policyManager: {
    id: string;
    policies: {
      id: string;
      identifier: string;
    }[];
  };
  holdings: {
    id: string;
    assetGav: BigNumber;
    amount: BigNumber;
    asset: {
      id: string;
      symbol: string;
      decimals: number;
    };
  }[];
  calculationsHistory: {
    id: string;
    timestamp: string;
    sharePrice: BigNumber;
    gav: BigNumber;
  }[];
  firstPx: {
    id: string;
    timestamp: string;
    sharePrice: BigNumber;
    gav: BigNumber;
  }[];
  yearStartPx: {
    id: string;
    timestamp: string;
    sharePrice: BigNumber;
    gav: BigNumber;
  }[];
  monthStartPx: {
    id: string;
    timestamp: string;
    sharePrice: BigNumber;
    gav: BigNumber;
  }[];
}

export interface FundListQueryResult {
  funds: Fund[];
}

export interface FundListQueryVariables {
  startOfYearDate: BigNumber;
  startOfMonthDate: BigNumber;
}

const FundListQuery = gql`
  query FundListQuery($startOfYearDate: BigInt!, $startOfMonthDate: BigInt!) {
    funds(
      first: 1000
      where: { id_not: "0x1e3ef9a8fe3cf5b3440b0df8347f1888484b8dc2" }
      orderBy: "gav"
      orderDirection: "desc"
    ) {
      id
      name
      gav
      sharePrice
      totalSupply
      isShutdown
      createdAt
      investments {
        id
      }
      version {
        id
        name
      }
      accounting {
        id
        denominationAsset {
          id
          symbol
        }
      }
      policyManager {
        id
        policies {
          id
          identifier
        }
      }
      holdings(orderBy: assetGav, orderDirection: desc) {
        id
        amount
        assetGav
        asset {
          id
          symbol
          decimals
        }
      }
      calculationsHistory(orderBy: timestamp, orderDirection: desc, first: 2) {
        id
        timestamp
        sharePrice
        gav
      }

      firstPx: calculationsHistory(where: { gav_gt: 0 }, orderBy: timestamp, orderDirection: asc, first: 1) {
        id
        timestamp
        sharePrice
        gav
      }

      yearStartPx: calculationsHistory(
        where: { timestamp_gt: $startOfYearDate }
        orderBy: timestamp
        orderDirection: asc
        first: 1
      ) {
        id
        timestamp
        sharePrice
        gav
      }

      monthStartPx: calculationsHistory(
        where: { timestamp_gt: $startOfMonthDate }
        orderBy: timestamp
        orderDirection: asc
        first: 1
      ) {
        id
        timestamp
        sharePrice
        gav
      }
    }
  }
`;

export const useFundListQuery = (startOfMonthDate: BigNumber, startOfYearDate: BigNumber) => {
  const options = {
    variables: {
      startOfYearDate,
      startOfMonthDate,
    },
  };

  const result = useTheGraphQuery<FundListQueryResult, FundListQueryVariables>(FundListQuery, options);

  return result;
};
