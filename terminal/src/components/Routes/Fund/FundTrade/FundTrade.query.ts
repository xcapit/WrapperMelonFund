import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';
import { useMemo } from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { ExchangeDefinition } from '@melonproject/melonjs';

export interface FundTradingVariables {
  fund?: string;
}

const FundTrading = gql`
  query FundTrading($fund: String!) {
    fund(address: $fund) {
      name
      routes {
        accounting {
          address
          denominationAsset {
            address
            symbol
            decimals
          }
        }
        trading {
          address
          exchanges {
            exchange
            adapter
          }
        }
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

export const useFundTrading = (fund?: string) => {
  const environment = useEnvironment()!;
  const result = useOnChainQuery<FundTradingVariables>(FundTrading, {
    skip: !fund,
    variables: { fund },
  });

  const denominationAsset = result.data?.fund?.routes?.accounting?.denominationAsset;
  const trading = result.data?.fund?.routes?.trading?.address;
  const policies = result.data?.fund?.routes?.policyManager?.policies;
  const exchanges = useMemo(() => {
    const addresses = result.data?.fund?.routes?.trading?.exchanges || [];
    return addresses.reduce<ExchangeDefinition[]>((carry, current) => {
      const exchange = environment.getExchange(current as any);
      return exchange ? [...carry, exchange] : carry;
    }, []);
  }, [result.data]);

  return [exchanges, denominationAsset, trading, policies, result] as [
    typeof exchanges,
    typeof denominationAsset,
    typeof trading,
    typeof policies,
    typeof result
  ];
};
