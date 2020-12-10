import React from 'react';
import { useFundPoliciesQuery } from './FundPolicies.query';
import { Fallback } from '~/components/Common/Fallback/Fallback';

export interface RequiresNoPoliciesDeployedProps {
  address: string;
  loader?: React.ReactElement;
  fallback?: React.ReactNode;
}

export const RequiresNoPoliciesDeployed: React.FC<RequiresNoPoliciesDeployedProps> = ({
  loader,
  children,
  fallback = true,
  address,
}) => {
  const [policyManager, query] = useFundPoliciesQuery(address);

  if (query.loading) {
    return loader || null;
  }

  const policies = policyManager?.policies || [];

  if (policies.length === 0) {
    return <>{children}</>;
  }

  const output =
    fallback === true ? (
      <Fallback>The fund needs to have no deployed policies to access this page.</Fallback>
    ) : (
      fallback
    );
  return <>{output || null}</>;
};
