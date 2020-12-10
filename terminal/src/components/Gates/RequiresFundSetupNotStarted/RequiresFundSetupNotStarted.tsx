import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Fallback } from '~/components/Common/Fallback/Fallback';
import { useAccount } from '~/hooks/useAccount';

export interface RequiresFundSetupNotStartedProps {
  fallback?: React.ReactNode;
}

export const RequiresFundSetupNotStarted: React.FC<RequiresFundSetupNotStartedProps> = ({
  children,
  fallback = true,
}) => {
  const environment = useEnvironment();
  const account = useAccount();

  if (environment && account && !account.fund) {
    return <>{children}</>;
  }

  const output =
    fallback === true ? (
      <Fallback>You can only view this page if you have not yet set up your fund.</Fallback>
    ) : (
      fallback
    );
  return <>{output || null}</>;
};
