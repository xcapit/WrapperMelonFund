import gql from 'graphql-tag';
import BigNumber from 'bignumber.js';
import { useOnChainQuery } from '~/hooks/useQuery';
import { Address } from '@melonproject/melonjs';

export interface FundPolicy {
  address: Address;
  identifier: string;
  type: string;
}

export interface PolicyManager {
  address: Address;
  policies?: FundPolicy[];
}

export interface CustomPolicy extends FundPolicy {
  type: 'CustomPolicy';
}

export interface MaxConcentrationPolicy extends FundPolicy {
  type: 'MaxConcentration';
  maxConcentration: BigNumber;
}

export interface MaxPositionsPolicy extends FundPolicy {
  type: 'MaxPositions';
  maxPositions: BigNumber;
}

export interface PriceTolerancePolicy extends FundPolicy {
  type: 'PriceTolerance';
  priceTolerance: BigNumber;
}

export interface AssetBlacklistPolicy extends FundPolicy {
  type: 'AssetBlacklist';
  assetBlacklist: string[];
}

export interface AssetWhitelistPolicy extends FundPolicy {
  type: 'AssetWhitelist';
  assetWhitelist: string[];
}

export interface FundPoliciesQueryVariables {
  address: string;
}

const FundPoliciesQuery = gql`
  query FundPoliciesQuery($address: String!) {
    fund(address: $address) {
      routes {
        policyManager {
          address
          policies {
            type: __typename
            address
            identifier

            ... on MaxConcentration {
              maxConcentration
            }

            ... on MaxPositions {
              maxPositions
            }

            ... on PriceTolerance {
              priceTolerance
            }

            ... on AssetWhitelist {
              assetWhitelist
            }

            ... on AssetBlacklist {
              assetBlacklist
            }
          }
        }
      }
    }
  }
`;

export const useFundPoliciesQuery = (address: string) => {
  const options = {
    variables: { address: address?.toLowerCase() },
  };

  const result = useOnChainQuery<FundPoliciesQueryVariables>(FundPoliciesQuery, options);
  const output = result.data?.fund?.routes?.policyManager as PolicyManager;

  return [output, result] as [typeof output, typeof result];
};
