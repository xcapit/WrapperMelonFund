import React from 'react';
import { useFund } from '~/hooks/useFund';
import { Fallback } from '~/components/Common/Fallback/Fallback';

export interface RequiresFundShutDownProps {
  loader?: React.ReactElement;
  fallback?: React.ReactNode;
}

export const RequiresFundShutDown: React.FC<RequiresFundShutDownProps> = ({ loader, children, fallback = true }) => {
  const fund = useFund();

  if (fund.loading) {
    return loader || null;
  }

  if (fund && fund.isShutDown) {
    return <>{children}</>;
  }

  const output = fallback === true ? <Fallback>This fund is still active.</Fallback> : fallback;
  return <>{output || null}</>;
};
