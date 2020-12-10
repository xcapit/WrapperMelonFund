import React from 'react';
// @ts-ignore
import Fortmatic from 'fortmatic';
import { Eth } from 'web3-eth';
import { switchMap, startWith, catchError } from 'rxjs/operators';
import * as Rx from 'rxjs';
import {
  connectionEstablished,
  ConnectionMethodProps,
  ConnectionMethod,
  connectionLost,
} from '~/components/Contexts/Connection/Connection';
import { SectionTitle } from '~/storybook/Title/Title';
import { Button } from '~/components/Form/Button/Button.styles';
import { networkFromId } from '~/utils/networkFromId';

interface Resource extends Rx.Unsubscribable {
  eth: Eth;
  provider: any;
}

const connect = () => {
  const create = () => {
    const fm = new Fortmatic(process.env.MELON_FORTMATIC_KEY);
    const provider = fm.getProvider();
    const eth = new Eth(provider as any, undefined, {
      transactionConfirmationBlocks: 1,
      transactionPollingTimeout: Infinity,
      transactionBlockTimeout: Infinity,
    });

    return { eth, provider, unsubscribe: () => fm.user.logout() };
  };

  return Rx.using(create, (resource) => {
    const eth = (resource as Resource).eth;
    const provider = (resource as Resource).provider;

    const enable$ = Rx.defer(() => provider.enable() as Promise<string[]>).pipe(startWith([]));
    const initial$ = enable$.pipe(
      switchMap(async (accounts) => {
        const network = networkFromId(await eth.net.getId());
        return connectionEstablished(eth, network, accounts);
      }),
      catchError(() => Rx.of(connectionLost()))
    );

    return Rx.concat(initial$, Rx.NEVER);
  });
};

export const FortmaticComponent: React.FC<ConnectionMethodProps> = ({ connect, disconnect, active }) => {
  return (
    <>
      <SectionTitle>Fortmatic</SectionTitle>

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
  supported: () => !!process.env.MELON_FORTMATIC_KEY,
  component: FortmaticComponent,
  icon: 'FORTMATIC',
  name: 'fortmatic',
  label: 'Fortmatic',
};
