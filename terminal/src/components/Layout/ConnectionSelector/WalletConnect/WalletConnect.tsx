import React from 'react';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Eth } from 'web3-eth';
import { switchMap, map, catchError } from 'rxjs/operators';
import * as Rx from 'rxjs';
import {
  connectionLost,
  connectionEstablished,
  ConnectionMethodProps,
  ConnectionMethod,
  networkChanged,
  accountsChanged,
} from '~/components/Contexts/Connection/Connection';
import { SectionTitle } from '~/storybook/Title/Title';
import { Button } from '~/components/Form/Button/Button.styles';
import { networkFromId } from '~/utils/networkFromId';
import { getConfig } from '~/config';
import { NetworkEnum } from '~/types';

interface Resource extends Rx.Unsubscribable {
  eth: Eth;
  provider: WalletConnectProvider;
}

const mainnetConfig = getConfig(NetworkEnum.MAINNET);
const kovanConfig = getConfig(NetworkEnum.KOVAN);
const rinkebyConfig = getConfig(NetworkEnum.RINKEBY);

const connect = () => {
  const create = () => {
    const provider = new WalletConnectProvider({
      rpc: {
        ...(!!mainnetConfig && {
          [NetworkEnum.MAINNET]: mainnetConfig.provider,
        }),
        ...(!!rinkebyConfig && {
          [NetworkEnum.RINKEBY]: rinkebyConfig.provider,
        }),
        ...(!!kovanConfig && {
          [NetworkEnum.KOVAN]: kovanConfig.provider,
        }),
      },
    });

    const eth = new Eth(provider as any, undefined, {
      transactionConfirmationBlocks: 1,
      transactionPollingTimeout: Infinity,
      transactionBlockTimeout: Infinity,
    });

    return { eth, provider, unsubscribe: () => provider.close() };
  };

  return Rx.using(create, (resource) => {
    const provider = (resource as Resource).provider;
    const eth = (resource as Resource).eth;

    const enable$ = Rx.defer(() => provider.enable() as Promise<string[]>);
    const initial$ = enable$.pipe(
      switchMap(async (accounts) => {
        const network = networkFromId(await eth.net.getId());
        return connectionEstablished(eth, network, accounts);
      })
    );

    const network$ = Rx.fromEvent<string>(provider as any, 'networkChanged').pipe(
      map((id) => networkChanged(networkFromId(parseInt(id, 10))))
    );

    const accounts$ = Rx.concat(enable$, Rx.fromEvent<string[]>(provider as any, 'accountsChanged')).pipe(
      map((accounts) => accountsChanged(accounts))
    );

    return Rx.concat(initial$, Rx.merge(accounts$, network$)).pipe(catchError(() => Rx.of(connectionLost())));
  });
};

export const WalletConnectComponent: React.FC<ConnectionMethodProps> = ({ connect, disconnect, active }) => {
  return (
    <>
      <SectionTitle>WalletConnect</SectionTitle>

      {!active ? (
        <Button length="stretch" onClick={() => connect()}>
          Connect
        </Button>
      ) : (
        <Button length="stretch" onClick={() => disconnect()}>
          Disconnect
        </Button>
      )}
    </>
  );
};

export const method: ConnectionMethod = {
  connect,
  supported: () => true,
  component: WalletConnectComponent,
  icon: 'WALLETCONNECT',
  name: 'walletconnect',
  label: 'WalletConnect',
};
