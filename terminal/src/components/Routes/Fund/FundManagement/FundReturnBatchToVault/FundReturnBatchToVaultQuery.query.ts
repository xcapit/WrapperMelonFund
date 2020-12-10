import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';

export interface FundReturnBatchToVaultQueryVariables {
  address: string;
}

const FundReturnBatchToVaultQuery = gql`
  query FundReturnBatchToVaultQuery($address: String!) {
    fund(address: $address) {
      address
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

export const useFundReturnBatchToVaultQuery = (address: string) => {
  const options = {
    variables: { address: address?.toLowerCase() },
  };

  const result = useOnChainQuery<FundReturnBatchToVaultQueryVariables>(FundReturnBatchToVaultQuery, options);
  const addresses = (result.data?.fund?.routes?.trading?.lockedAssets ?? []).map((item) => item.address!);
  return [addresses, result] as [typeof addresses, typeof result];
};
