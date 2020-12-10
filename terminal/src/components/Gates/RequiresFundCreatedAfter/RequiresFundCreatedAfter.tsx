import React from 'react';
import { useFund } from '~/hooks/useFund';
import { Fallback } from '~/components/Common/Fallback/Fallback';

export interface RequiresFundCreatedAfterProps {
  loader?: React.ReactElement;
  fallback?: React.ReactNode;
  after: Date;
}

export const RequiresFundCreatedAfter: React.FC<RequiresFundCreatedAfterProps> = ({
  loader,
  children,
  fallback = true,
  after,
}) => {
  const fund = useFund();

  if (fund.loading) {
    return loader || null;
  }

  const creationTime = fund.creationTime || new Date();

  if (creationTime > after) {
    return <>{children}</>;
  }

  const output =
    fallback === true ? (
      <Fallback>The fund needs to have been created after {after.toString()} to access this page.</Fallback>
    ) : (
      fallback
    );
  return <>{output || null}</>;
};
