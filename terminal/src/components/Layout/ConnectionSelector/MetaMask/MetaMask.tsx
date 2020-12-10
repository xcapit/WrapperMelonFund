import React from 'react';
import * as Rx from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';
import { Eth } from 'web3-eth';
import { networkFromId } from '~/utils/networkFromId';
import {
  networkChanged,
  accountsChanged,
  connectionEstablished,
  ConnectionAction,
  ConnectionMethod,
  ConnectionMethodProps,
} from '~/components/Contexts/Connection/Connection';
import { SectionTitle } from '~/storybook/Title/Title';
import { Button } from '~/components/Form/Button/Button';

const supported = () => {
  const ethereum = (window as any).ethereum;
  return !!(ethereum && ethereum.isMetaMask);
};

const connect = (): Rx.Observable<ConnectionAction> => {
  const ethereum = (window as any).ethereum;
  if (!ethereum || !ethereum.isMetaMask) {
    return Rx.NEVER;
  }

  const eth = new Eth(ethereum, undefined, {
    transactionConfirmationBlocks: 1,
    transactionPollingTimeout: Infinity,
    transactionBlockTimeout: Infinity,
  });

  const enable$ = Rx.defer(() => ethereum.enable() as Promise<string[]>).pipe(startWith([]));
  const initial$ = enable$.pipe(
    switchMap(async (accounts) => {
      const network = networkFromId(await eth.net.getId());
      return connectionEstablished(eth, network, accounts);
    })
  );

  const network$ = Rx.fromEvent<string>(ethereum, 'networkChanged').pipe(
    map((id) => networkChanged(networkFromId(parseInt(id, 10))))
  );

  const accounts$ = Rx.concat(enable$, Rx.fromEvent<string[]>(ethereum, 'accountsChanged')).pipe(
    map((accounts) => accountsChanged(accounts))
  );

  return Rx.concat(initial$, Rx.merge(accounts$, network$));
};

export const MetaMask: React.FC<ConnectionMethodProps> = ({ connect, disconnect, active }) => {
  return (
    <>
      <SectionTitle>Metamask</SectionTitle>
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
  supported,
  component: MetaMask,
  icon: 'METAMASK',
  name: 'metamask',
  label: 'MetaMask',
};
