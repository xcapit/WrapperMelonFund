import React from 'react';
import * as Rx from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Eth } from 'web3-eth';
import { networkFromId } from '~/utils/networkFromId';
import {
  connectionEstablished,
  ConnectionAction,
  ConnectionMethod,
  ConnectionMethodProps,
} from '~/components/Contexts/Connection/Connection';
import { SectionTitle } from '~/storybook/Title/Title';
import { Button } from '~/components/Form/Button/Button';

const supported = () => {
  const ethereum = (window as any).ethereum;
  return !!(ethereum && ethereum.isDapper);
};

const connect = (): Rx.Observable<ConnectionAction> => {
  const ethereum = (window as any).ethereum;
  if (!ethereum || !ethereum.isDapper) {
    return Rx.NEVER;
  }

  const eth = new Eth(ethereum, undefined, {
    transactionConfirmationBlocks: 1,
    transactionPollingTimeout: Infinity,
    transactionBlockTimeout: Infinity,
  });

  const enable$ = Rx.defer(() => ethereum.enable() as Promise<string[]>);
  const initial$ = enable$.pipe(
    switchMap(async (accounts) => {
      const network = networkFromId(await eth.net.getId());
      return connectionEstablished(eth, network, accounts);
    })
  );

  return initial$;
};

export const Dapper: React.FC<ConnectionMethodProps> = ({ connect, disconnect, active }) => {
  return (
    <>
      <SectionTitle>Dapper</SectionTitle>
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
  component: Dapper,
  icon: 'DAPPER',
  name: 'dapper',
  label: 'Dapper',
};
