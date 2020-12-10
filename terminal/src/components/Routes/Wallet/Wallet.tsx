import React, { Suspense } from 'react';
import ErrorBoundary from 'react-error-boundary';
import { Switch, Route, useRouteMatch } from 'react-router';
import { Container } from '~/storybook/Container/Container';
import { Spinner } from '~/storybook/Spinner/Spinner';
import { ErrorFallback } from '~/components/Common/ErrorFallback/ErrorFallback';
import { WalletHeader } from './WalletHeader/WalletHeader';
import { WalletNavigation } from './WalletNavigation/WalletNavigation';

const NoMatch = React.lazy(() => import('~/components/Routes/NoMatch/NoMatch'));
const WalletOverview = React.lazy(() => import('./WalletOverview/WalletOverview'));
const WalletWeth = React.lazy(() => import('./WalletWeth/WalletWeth'));
const WalletFundSetup = React.lazy(() => import('./WalletFundSetup/WalletFundSetup'));

export const Wallet: React.FC = () => {
  const match = useRouteMatch()!;

  return (
    <>
      <WalletHeader />
      <WalletNavigation />
      <Container>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<Spinner />}>
            <Switch>
              <Route path={match.path} exact={true}>
                <WalletOverview />
              </Route>
              <Route path={`${match.path}/weth`} exact={true}>
                <WalletWeth />
              </Route>
              <Route path={`${match.path}/setup`} exact={true}>
                <WalletFundSetup />
              </Route>
              <Route>
                <NoMatch />
              </Route>
            </Switch>
          </Suspense>
        </ErrorBoundary>
      </Container>
    </>
  );
};

export default Wallet;
