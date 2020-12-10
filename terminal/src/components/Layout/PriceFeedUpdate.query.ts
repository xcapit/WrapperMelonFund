import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';

const PriceFeedUpdateQuery = gql`
  query PriceFeedUpdateQuery {
    prices {
      lastUpdate
    }
  }
`;

export const usePriceFeedUpdateQuery = () => {
  const result = useOnChainQuery(PriceFeedUpdateQuery);
  const output = result.data?.prices?.lastUpdate;
  return [output, result] as [typeof output, typeof result];
};
