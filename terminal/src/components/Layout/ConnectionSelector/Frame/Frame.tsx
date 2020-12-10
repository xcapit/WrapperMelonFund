import React from 'react';
import * as Rx from 'rxjs';
import { equals } from 'ramda';
import { Eth } from 'web3-eth';
import { HttpProvider } from 'web3-providers';
import {
  ConnectionMethod,
  ConnectionAction,
  networkChanged,
  accountsChanged,
  connectionEstablished,
  ConnectionMethodProps,
} from '~/components/Contexts/Connection/Connection';
import {
  map,
  expand,
  concatMap,
  retryWhen,
  delay,
  take,
  distinctUntilChanged,
  share,
  skip,
  catchError,
} from 'rxjs/operators';
import { networkFromId } from '~/utils/networkFromId';
import { SectionTitle } from '~/storybook/Title/Title';
import { Button } from '~/components/Form/Button/Button';

interface Resource extends Rx.Unsubscribable {
  eth: Eth;
}

const connect = (): Rx.Observable<ConnectionAction> => {
  const create = (): Resource => {
    const provider = new HttpProvider('http://localhost:1248');
    const eth = new Eth(provider, undefined, {
      transactionConfirmationBlocks: 1,
      transactionPollingTimeout: Infinity,
      transactionBlockTimeout: Infinity,
    });

    return { eth, unsubscribe: () => provider.disconnect() };
  };

  return Rx.using(create, (resource) => {
    const eth = (resource as Resource).eth;
    const connect$ = Rx.defer(async () => {
      const [id, accounts] = await Promise.all([eth.net.getId(), eth.getAccounts().catch(() => [])]);
      const network = networkFromId(id);
      return [network, accounts] as [typeof network, typeof accounts];
    }).pipe(
      retryWhen((error) => error.pipe(delay(1000))),
      take(1),
      share()
    );

    const enable$ = connect$.pipe(map(([network, accounts]) => connectionEstablished(eth, network, accounts)));

    const accounts$ = connect$.pipe(
      map(([, accounts]) => accounts),
      expand(() =>
        Rx.timer(1000).pipe(
          concatMap(() => eth.getAccounts()),
          catchError(() => Rx.of([]))
        )
      ),
      distinctUntilChanged((a, b) => equals(a, b)),
      map((accounts) => accountsChanged(accounts)),
      skip(1)
    );

    const network$ = connect$.pipe(
      map(([network]) => network),
      expand(() =>
        Rx.timer(1000).pipe(
          concatMap(() => eth.net.getId()),
          map((id) => networkFromId(id)),
          catchError(() => Rx.of(undefined))
        )
      ),
      distinctUntilChanged((a, b) => equals(a, b)),
      map((network) => networkChanged(network)),
      skip(1)
    );

    return Rx.concat(enable$, Rx.merge(network$, accounts$));
  });
};

export const Frame: React.FC<ConnectionMethodProps> = ({ connect, disconnect, active }) => {
  return (
    <>
      <SectionTitle>Frame</SectionTitle>
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
  component: Frame,
  icon: 'FRAME',
  name: 'frame',
  label: 'Frame',
};
