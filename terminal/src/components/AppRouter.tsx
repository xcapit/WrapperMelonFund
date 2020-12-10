import React, { Suspense } from 'react';
import ErrorBoundary from 'react-error-boundary';
import { Route, Switch, Redirect, useRouteMatch } from 'react-router-dom';
import { RequiresAccount } from './Gates/RequiresAccount/RequiresAccount';
import { RequiresConnection } from './Gates/RequiresConnection/RequiresConnection';
import { Spinner } from '../storybook/Spinner/Spinner';
import { ErrorFallback } from './Common/ErrorFallback/ErrorFallback';
import { Layout } from './Layout/Layout';
import { RequiresRates } from './Contexts/Rates/Rates';
import { KYCGuide } from './Routes/Fund/FundInvestRedeem/KYC/KYCGuide/KYCGuide';

const Home = React.lazy(() => import('./Routes/Home/Home'));
const Wallet = React.lazy(() => import('./Routes/Wallet/Wallet'));
const Fund = React.lazy(() => import('./Routes/Fund/Fund'));
const NoMatch = React.lazy(() => import('./Routes/NoMatch/NoMatch'));

export interface AppRouterProps {
  connectionSwitch: boolean;
}

const RedirectLegacyFundRoute = () => {
  const match = useRouteMatch<{
    address: string;
  }>();

  return <Redirect to={`/mainnet/fund/${match.params.address}`} />;
};

export const AppRouter: React.FC<AppRouterProps> = (props) => {
  return (
    <Layout connectionSwitch={props.connectionSwitch}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <RequiresRates>
          <Suspense fallback={<Spinner size="large" positioning="overlay" />}>
            <Switch>
              <Route path="/" exact={true}>
                <RequiresConnection>
                  <Home />
                </RequiresConnection>
              </Route>
              <Route path="/wallet">
                <RequiresAccount>
                  <Wallet />
                </RequiresAccount>
              </Route>

              <Route path={`/fund/:address`}>
                <RedirectLegacyFundRoute />
              </Route>

              <Route path={`/:network(mainnet|kovan|rinkeby|testnet)/fund/:address`}>
                <RequiresConnection>
                  <Fund />
                </RequiresConnection>
              </Route>

              <Route path={`/kyc-guide`}>
                <KYCGuide />
              </Route>

              <Route>
                <NoMatch />
              </Route>
            </Switch>
          </Suspense>
        </RequiresRates>
      </ErrorBoundary>
    </Layout>
  );
};
