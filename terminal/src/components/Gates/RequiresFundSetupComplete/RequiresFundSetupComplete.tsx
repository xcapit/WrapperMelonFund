import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useFund } from '~/hooks/useFund';
import { Fallback } from '~/components/Common/Fallback/Fallback';

export interface RequiresFundSetupCompleteProps {
  fallback?: React.ReactNode;
}

export const RequiresFundSetupComplete: React.FC<RequiresFundSetupCompleteProps> = ({ children, fallback = true }) => {
  const environment = useEnvironment();
  const fund = useFund();

  if (environment && fund && fund.progress && fund.progress === 'COMPLETE') {
    return <>{children}</>;
  }

  const output = fallback === true ? <Fallback>Fund setup is not completed.</Fallback> : fallback;
  return <>{output || null}</>;
};
