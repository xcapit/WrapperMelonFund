import BigNumber from 'bignumber.js';
import gql from 'graphql-tag';
import { useTokenRates } from '~/components/Contexts/Rates/Rates';
import { useTheGraphQuery } from '~/hooks/useQuery';
import { calculateChangeFromSharePrice } from '~/utils/calculateChangeFromSharePrice';

export interface AssetPrice {
  id: string;
  asset: {
    id: string;
    symbol: string;
    decimals: number;
  };
  price: BigNumber;
}

export interface PriceUpdate {
  id: string;
  timestamp: string;
  assetPrices: AssetPrice[];
}

export interface PriceQueryResult {
  assetPriceUpdates: PriceUpdate[];
}

const PriceQuery = gql`
  query PriceQuery {
    assetPriceUpdates(orderBy: timestamp, orderDirection: desc, first: 1000) {
      id
      timestamp
      assetPrices {
        id
        asset {
          id
          symbol
          decimals
        }
        price
      }
    }
  }
`;

export const usePriceQuery = () => {
  const result = useTheGraphQuery<PriceQueryResult>(PriceQuery);

  return result;
};
