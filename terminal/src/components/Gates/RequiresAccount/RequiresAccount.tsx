import React from 'react';
import { useAccount } from '~/hooks/useAccount';
import { Fallback } from '~/components/Common/Fallback/Fallback';
import { Container } from '~/storybook/Container/Container';

export interface RequiresAccountProps {
  loader?: React.ReactElement;
  fallback?: React.ReactNode;
}

export const RequiresAccount: React.FC<RequiresAccountProps> = ({ loader, children, fallback = true }) => {
  const account = useAccount();

  if (account.loading) {
    return loader || null;
  }

  if (account && account.address) {
    return <>{children}</>;
  }

  const output =
    fallback === true ? (
      <Container>
        <Fallback>You have to be logged in to see this page.</Fallback>
      </Container>
    ) : (
      fallback
    );
  return <>{output || null}</>;
};
