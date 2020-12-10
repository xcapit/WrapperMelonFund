import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';

export interface FundInvestmentAssetsQueryVariables {
  address: string;
}

const FundInvestmentAssetsQuery = gql`
  query useFundInvestmentAssetsQuery($address: Address!) {
    fund(address: $address) {
      routes {
        participation {
          address
          allowedAssets {
            token {
              address
              symbol
              name
              decimals
            }
          }
        }
      }
    }
  }
`;

export const useFundInvestmentAssetsQuery = (address: string) => {
  const options = {
    variables: { address: address?.toLowerCase() },
  };

  const result = useOnChainQuery<FundInvestmentAssetsQueryVariables>(FundInvestmentAssetsQuery, options);
  return [result.data, result] as [typeof result.data, typeof result];
};
