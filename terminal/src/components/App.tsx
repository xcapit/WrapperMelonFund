import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './Theme';
import { ApolloProvider } from './Contexts/Apollo/Apollo';
import { ConnectionProvider } from './Contexts/Connection/Connection';
import { RatesProvider } from './Contexts/Rates/Rates';
import { AccountProvider } from './Contexts/Account/Account';
import { CurrencyProvider } from './Contexts/Currency/Currency';

// NOTE: Imported using root relative import to allow overrides with webpack.
import { AppRouter } from '~/components/AppRouter';

// TODO: Consider excluding ganache in production builds entirely.
import { method as metamask } from './Layout/ConnectionSelector/MetaMask/MetaMask';
import { method as dapper } from './Layout/ConnectionSelector/Dapper/Dapper';
import { method as coinbase } from './Layout/ConnectionSelector/Coinbase/Coinbase';
import { method as frame } from './Layout/ConnectionSelector/Frame/Frame';
import { method as ganache } from './Layout/ConnectionSelector/Ganache/Ganache';
import { method as fortmatic } from './Layout/ConnectionSelector/Fortmatic/Fortmatic';
import { method as anonymous } from './Layout/ConnectionSelector/Anonymous/Anonymous';
import { method as walletconnect } from './Layout/ConnectionSelector/WalletConnect/WalletConnect';
import { FundListProvider } from './Contexts/FundList/FundList';

let methods = [ganache, metamask, dapper, coinbase, frame, walletconnect, fortmatic];
let start = anonymous;
let switchable = true;

if (coinbase.supported()) {
  start = coinbase;
  methods = [coinbase];
  switchable = false;
}

const AppComponent = () => (
  <ThemeProvider>
    <ConnectionProvider methods={methods} default={start} disconnect={anonymous}>
      <ApolloProvider>
        <AccountProvider>
          <RatesProvider>
            <CurrencyProvider>
              <FundListProvider>
                <Router>
                  <AppRouter connectionSwitch={switchable} />
                </Router>
              </FundListProvider>
            </CurrencyProvider>
          </RatesProvider>
        </AccountProvider>
      </ApolloProvider>
    </ConnectionProvider>
  </ThemeProvider>
);

export const App = AppComponent;
