import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';
import { useAccount } from '~/hooks/useAccount';

export interface FundInvestQueryVariables {
  fund: string;
  account?: string;
}

const FundInvestQuery = gql`
  query useFundInvestQuery($account: Address!, $fund: Address!) {
    account(address: $account) {
      participation(address: $fund) {
        address
        hasInvested
        investmentRequestState
        canCancelRequest
        request {
          investmentAsset
          investmentAmount
          requestedShares
          timestamp
        }
      }
      shares(address: $fund) {
        address
        balanceOf
      }
    }
    fund(address: $fund) {
      routes {
        accounting {
          address
          denominationAsset {
            address
            symbol
            decimals
          }
          holdings {
            token {
              address
              symbol
              price
            }
            amount
            value
          }
        }
        participation {
          address
          allowedAssets {
            token {
              address
              symbol
              name
              price
              decimals
            }
            shareCostInAsset
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

            ... on UserWhitelist {
              isWhitelisted(address: $account)
            }
          }
        }
        shares {
          totalSupply
        }
      }
    }
  }
`;

export const useFundInvestQuery = (fund: string) => {
  const account = useAccount();
  const options = {
    skip: !account.address,
    variables: { fund, account: account.address },
  };

  const result = useOnChainQuery<FundInvestQueryVariables>(FundInvestQuery, options);
  return [result.data, result] as [typeof result.data, typeof result];
};
