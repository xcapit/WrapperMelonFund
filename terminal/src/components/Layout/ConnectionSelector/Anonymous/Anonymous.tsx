import React from 'react';
import * as Rx from 'rxjs';
import { Eth } from 'web3-eth';
import { HttpProvider } from 'web3-providers';
import {
  ConnectionMethod,
  ConnectionAction,
  connectionEstablished,
  ConnectionMethodProps,
} from '~/components/Contexts/Connection/Connection';
import { map, retryWhen, delay, take, share } from 'rxjs/operators';
import { networkFromId } from '~/utils/networkFromId';
import { SectionTitle } from '~/storybook/Title/Title';
import { Button } from '~/components/Form/Button/Button';
import { NetworkEnum } from '~/types';
import { getConfig } from '~/config';

interface Resource extends Rx.Unsubscribable {
  eth: Eth;
}

const connect = (): Rx.Observable<ConnectionAction> => {
  const [, path] = window.location.pathname.split('/', 2);
  const providers: {
    [key: string]: string | undefined;
  } = {
    testnet: getConfig(NetworkEnum.TESTNET)?.provider,
    mainnet: getConfig(NetworkEnum.MAINNET)?.provider,
    kovan: getConfig(NetworkEnum.KOVAN)?.provider,
    rinkeby: getConfig(NetworkEnum.RINKEBY)?.provider,
  };

  const endpoint = providers[path] || Object.values(providers).find((provider) => !!provider);
  if (!endpoint) {
    return Rx.EMPTY;
  }

  const create = (): Resource => {
    const provider = new HttpProvider(endpoint);
    const eth = new Eth(provider, undefined, {
      transactionConfirmationBlocks: 1,
      transactionPollingTimeout: Infinity,
      transactionBlockTimeout: Infinity,
    });

    return { eth, unsubscribe: () => provider.disconnect() };
  };

  return Rx.using(create, (resource) => {
    const eth = (resource as Resource).eth;
    const connect$ = Rx.defer(async () => networkFromId(await eth.net.getId())).pipe(
      retryWhen((error) => error.pipe(delay(10000))),
      take(1),
      share()
    );

    const initial$ = connect$.pipe(map((network) => connectionEstablished(eth, network)));
    return initial$;
  });
};

export const Anonymous: React.FC<ConnectionMethodProps> = ({ connect, active }) => {
  return (
    <>
      <SectionTitle>Anonymous</SectionTitle>
      {!active ? (
        <Button length="stretch" onClick={() => connect()}>
          Connect
        </Button>
      ) : (
        <span>Currently selected</span>
      )}
    </>
  );
};

export const method: ConnectionMethod = {
  connect,
  supported: () => true,
  component: Anonymous,
  name: 'anonymous',
  label: 'Anonymous',
};
