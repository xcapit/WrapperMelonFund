import React from 'react';
import { useFund } from '~/hooks/useFund';
import { Fallback } from '~/components/Common/Fallback/Fallback';

export interface RequiresFundNotShutDownProps {
  loader?: React.ReactElement;
  fallback?: React.ReactNode;
}

export const RequiresFundNotShutDown: React.FC<RequiresFundNotShutDownProps> = ({
  loader,
  children,
  fallback = true,
}) => {
  const fund = useFund();

  if (fund.loading) {
    return loader || null;
  }

  if (fund && !fund.isShutDown) {
    return <>{children}</>;
  }

  const output = fallback === true ? <Fallback>This fund is already shut down.</Fallback> : fallback;
  return <>{output || null}</>;
};
