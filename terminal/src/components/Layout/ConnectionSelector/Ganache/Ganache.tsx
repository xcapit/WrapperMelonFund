import React from 'react';
import * as Rx from 'rxjs';
import { retryWhen, delay } from 'rxjs/operators';
import { Eth } from 'web3-eth';
import { HttpProvider } from 'web3-providers';
import { networkFromId } from '~/utils/networkFromId';
import {
  connectionEstablished,
  ConnectionAction,
  ConnectionMethod,
  ConnectionMethodProps,
} from '~/components/Contexts/Connection/Connection';
import { SectionTitle } from '~/storybook/Title/Title';
import { Button } from '~/components/Form/Button/Button';

interface Resource extends Rx.Unsubscribable {
  eth: Eth;
}

const connect = (): Rx.Observable<ConnectionAction> => {
  const create = (): Resource => {
    const provider = new HttpProvider('http://127.0.0.1:8545');
    const eth = new Eth(provider, undefined, {
      transactionConfirmationBlocks: 1,
      transactionPollingTimeout: Infinity,
      transactionBlockTimeout: Infinity,
    });

    return { eth, unsubscribe: () => provider.disconnect() };
  };

  return Rx.using(create, (resource) => {
    const eth = (resource as Resource).eth;

    const connection$ = Rx.defer(async () => {
      const [id, accounts] = await Promise.all([eth.net.getId(), eth.getAccounts()]);
      const network = networkFromId(id);

      // NOTE: Use this to register custom unlocked accounts for simulation.
      const unlocked: string[] = [
        // '0xC0c82081f2Ad248391cd1483ae211d56c280887a'
      ];

      return connectionEstablished(eth, network, unlocked.concat(accounts));
    }).pipe(retryWhen((error) => error.pipe(delay(1000))));

    return Rx.concat(connection$, Rx.NEVER);
  });
};

export const Ganache: React.FC<ConnectionMethodProps> = ({ connect, disconnect, active }) => {
  return (
    <>
      <SectionTitle>Ganache</SectionTitle>

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
  supported: () => window.location.hostname === 'localhost',
  component: Ganache,
  icon: 'GANACHE',
  name: 'ganache',
  label: 'Ganache',
};
