import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';

export interface FundShutdownQueryVariables {
  address: string;
}

const FundShutdownQuery = gql`
  query FundShutdownQuery($address: String!) {
    fund(address: $address) {
      address
      routes {
        version {
          address
        }
        trading {
          address
          lockedAssets {
            address
          }
        }
        accounting {
          address
          holdings {
            token {
              address
            }
          }
        }
      }
    }
  }
`;

export const useFundShutdownQuery = (address: string) => {
  const options = {
    variables: { address: address?.toLowerCase() },
  };

  const result = useOnChainQuery<FundShutdownQueryVariables>(FundShutdownQuery, options);

  const fundShutDownResult = result.data?.fund ?? {};
  return [fundShutDownResult, result] as [typeof fundShutDownResult, typeof result];
};
