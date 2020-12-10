import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';

export interface FundVersionQueryResult {
  address: string;
  name: string;
}

export interface FundVersionQueryVariables {
  address: string;
}

const FundRegistryQuery = gql`
  query FundRegistryQuery($address: String!) {
    fund(address: $address) {
      routes {
        version {
          address
          name
        }
      }
    }
  }
`;

export const useFundVersionQuery = (address: string) => {
  const options = {
    variables: { address },
    skip: !address,
  };

  const result = useOnChainQuery<FundVersionQueryVariables>(FundRegistryQuery, options);
  const output = result.data?.fund?.routes?.version as FundVersionQueryResult;

  return [output, result] as [typeof output, typeof result];
};
