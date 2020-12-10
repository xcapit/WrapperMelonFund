import React from 'react';
import { useFund } from '~/hooks/useFund';
import { Fallback } from '~/components/Common/Fallback/Fallback';

export interface RequiresFundJustCreatedProps {
  loader?: React.ReactElement;
  fallback?: React.ReactNode;
}

export const RequiresFundJustCreated: React.FC<RequiresFundJustCreatedProps> = ({
  loader,
  children,
  fallback = true,
}) => {
  const fund = useFund();

  if (fund.loading) {
    return loader || null;
  }

  const creationTime = fund.creationTime?.getTime() || Date.now();
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

  if (creationTime > oneDayAgo) {
    return <>{children}</>;
  }

  const output =
    fallback === true ? <Fallback>The fund needs to be younger than one day to access this page.</Fallback> : fallback;
  return <>{output || null}</>;
};
