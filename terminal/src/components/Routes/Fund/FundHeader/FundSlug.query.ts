import gql from 'graphql-tag';
import { useTheGraphQuery } from '~/hooks/useQuery';

import { calculateChangeFromSharePrice } from '~/utils/calculateChangeFromSharePrice';
import BigNumber from 'bignumber.js';

export interface FundSlugQueryResult {
  fund: {
    slug: { id: string };
  };
}

export interface FundSlugQueryVariables {
  address: string;
}

const FundSlugQuery = gql`
  query FundSlugQuery($address: ID!) {
    fund(id: $address) {
      slug {
        id
      }
    }
  }
`;

export const useFundSlug = (address: string) => {
  const options = {
    variables: { address: address?.toLowerCase() },
  };

  const result = useTheGraphQuery<FundSlugQueryResult, FundSlugQueryVariables>(FundSlugQuery, options);

  const slug = result?.data?.fund?.slug?.id;

  return [slug, result] as [string | undefined, typeof result];
};
