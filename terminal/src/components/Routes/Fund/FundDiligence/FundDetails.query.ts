import gql from 'graphql-tag';
import BigNumber from 'bignumber.js';
import { useOnChainQuery } from '~/hooks/useQuery';

export interface FundDetails {
  name: string;
  manager: string;
  creationTime: Date;
  isShutDown: boolean;
  routes: {
    accounting?: {
      address: string;
      sharePrice: BigNumber;
      grossAssetValue: BigNumber;
      netAssetValue: BigNumber;
    };
    feeManager?: {
      address: string;
      managementFeeAmount: BigNumber;
      performanceFeeAmount: BigNumber;
      managementFee?: {
        rate: number;
      };
      performanceFee?: {
        rate: number;
        period: number;
        canUpdate: boolean;
        initializeTime: Date;
      };
    };
    participation?: {
      address: string;
      allowedAssets?: [
        {
          token?: {
            symbol?: string;
          };
        }
      ];
    };
    policyManager?: {
      address: string;
    };
    trading?: {
      address: string;
      exchanges?: [
        {
          exchange?: string;
          adapter?: string;
        }
      ];
    };
    shares?: {
      address: string;
      totalSupply: BigNumber;
    };
    vault?: {
      address: string;
    };
    version?: {
      address: string;
      name: string;
    };
    registry?: {
      address: string;
    };
    priceSource?: {
      address: string;
    };
  };
}

export interface AccountDetails {
  shares: {
    balanceOf: BigNumber;
  };
}

export interface FundDetailsQueryVariables {
  fund: string;
}

const FundDetailsQuery = gql`
  query FundDetailsQuery($fund: Address!) {
    fund(address: $fund) {
      name
      manager
      creationTime
      isShutDown
      routes {
        accounting {
          address
          grossAssetValue
          netAssetValue
          sharePrice
        }
        feeManager {
          address
          managementFeeAmount
          performanceFeeAmount
          managementFee {
            rate
          }
          performanceFee {
            rate
            period
            canUpdate
            initializeTime
          }
        }
        participation {
          address
          allowedAssets {
            token {
              symbol
            }
          }
        }
        policyManager {
          address
        }
        shares {
          address
          totalSupply
        }
        trading {
          address
          exchanges {
            exchange
            adapter
          }
        }
        vault {
          address
        }
        version {
          address
          name
        }
        registry {
          address
        }
        priceSource {
          address
        }
      }
    }
  }
`;

export const useFundDetailsQuery = (fund: string) => {
  const options = {
    variables: { fund },
  };

  const result = useOnChainQuery<FundDetailsQueryVariables>(FundDetailsQuery, options);
  return [result.data?.fund, result] as [FundDetails | undefined, typeof result];
};
