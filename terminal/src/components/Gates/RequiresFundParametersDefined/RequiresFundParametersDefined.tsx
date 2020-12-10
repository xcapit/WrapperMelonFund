import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccountFundQuery } from './AccountFund.query';
import { Fallback } from '~/components/Common/Fallback/Fallback';

export interface RequiresFundParametersDefinedProps {
  fallback?: React.ReactNode;
}

export const RequiresFundParametersDefined: React.FC<RequiresFundParametersDefinedProps> = ({
  children,
  fallback = true,
}) => {
  const environment = useEnvironment();
  const [account] = useAccountFundQuery();

  if (environment && account && account.fund) {
    return <>{children}</>;
  }

  const output =
    fallback === true ? (
      <Fallback>You can only view this page if you have already defined the main parameters of your fund.</Fallback>
    ) : (
      fallback
    );
  return <>{output || null}</>;
};
