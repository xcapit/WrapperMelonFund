import BigNumber from 'bignumber.js';
import gql from 'graphql-tag';
import { useTheGraphQuery } from '~/hooks/useQuery';
import React from 'react';

export interface InvestorTotalExposureResult {
  investor: {
    investments: [
      {
        gav: BigNumber;
      }
    ];
  };
}

export interface InvestorTotalExposureVariables {
  address?: string;
}

const InvestorExposureQuery = gql`
  query InvestorExposureQuery($address: ID!) {
    investor(id: $address) {
      investments {
        gav
      }
    }
  }
`;

export const useInvestorTotalExposureQuery = (address?: string) => {
  const result = useTheGraphQuery<InvestorTotalExposureResult, InvestorTotalExposureVariables>(InvestorExposureQuery, {
    variables: {
      address: address?.toLowerCase(),
    },
    skip: !address,
  });

  const totalExposure = React.useMemo(() => {
    return result?.data?.investor?.investments?.reduce((carry, item) => {
      return carry.plus(new BigNumber(item.gav));
    }, new BigNumber(0));
  }, [result]);

  return [totalExposure, result] as [typeof totalExposure, typeof result];
};
