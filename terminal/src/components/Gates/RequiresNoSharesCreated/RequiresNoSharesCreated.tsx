import React from 'react';
import { useFundDetailsQuery } from './FundDetails.query';
import BigNumber from 'bignumber.js';
import { Fallback } from '~/components/Common/Fallback/Fallback';

export interface RequiresNoSharesCreatedProps {
  address: string;
  loader?: React.ReactElement;
  fallback?: React.ReactNode;
}

export const RequiresNoSharesCreated: React.FC<RequiresNoSharesCreatedProps> = ({
  loader,
  children,
  fallback = true,
  address,
}) => {
  const [fund, query] = useFundDetailsQuery(address);

  if (query.loading) {
    return loader || null;
  }

  const numberOfShares = fund?.routes?.shares?.totalSupply || new BigNumber(0);

  if (numberOfShares.isZero()) {
    return <>{children}</>;
  }

  const output =
    fallback === true ? <Fallback>The fund needs to have no shares to access this page.</Fallback> : fallback;
  return <>{output || null}</>;
};
