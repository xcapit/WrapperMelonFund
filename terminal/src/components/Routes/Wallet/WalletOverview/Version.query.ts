import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';
import { useEnvironment } from '~/hooks/useEnvironment';

export interface Version {
  address: string;
  name: string;
}

export interface VersionQueryVariables {
  address?: string;
}

const VersionQuery = gql`
  query VersionQuery($address: String!) {
    version(address: $address) {
      address
      name
    }
  }
`;

export const useVersionQuery = (versionAddress?: string) => {
  const environment = useEnvironment();
  const address = versionAddress || environment?.deployment.melon.addr.Version;
  const options = {
    variables: { address },
    skip: !address,
  };

  const result = useOnChainQuery<VersionQueryVariables>(VersionQuery, options);
  const output = result.data?.version as Version;

  return [output, result] as [typeof output, typeof result];
};
