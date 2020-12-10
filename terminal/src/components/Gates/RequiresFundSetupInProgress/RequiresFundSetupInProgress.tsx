import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccountFundQuery } from './AccountFund.query';
import { sameAddress } from '@melonproject/melonjs';
import { useFund } from '~/hooks/useFund';

export interface RequiresFundSetupInProgressProps {
  fallback?: React.ReactNode;
}

export const RequiresFundSetupInProgress: React.FC<RequiresFundSetupInProgressProps> = ({
  children,
  fallback = false,
}) => {
  const environment = useEnvironment();
  const [account] = useAccountFundQuery();
  const fund = useFund();

  if (
    environment &&
    account &&
    account.fund?.progress &&
    account.fund?.progress !== 'COMPLETE' &&
    sameAddress(account.fund.address, fund.address)
  ) {
    return <>{children}</>;
  }

  return <>{fallback || null}</>;
};
