import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';

export interface FundExchangesQueryVariables {
  address: string;
}

const FundExchangesQuery = gql`
  query useExchangesQuery($address: Address!) {
    fund(address: $address) {
      routes {
        trading {
          address
          exchanges {
            exchange
            adapter
          }
        }
      }
    }
  }
`;

export const useFundExchangesQuery = (address: string) => {
  const options = {
    variables: { address: address?.toLowerCase() },
  };

  const result = useOnChainQuery<FundExchangesQueryVariables>(FundExchangesQuery, options);
  return [result.data, result] as [typeof result.data, typeof result];
};
