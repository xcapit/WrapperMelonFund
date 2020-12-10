import * as Rx from 'rxjs';
import React, { createContext, useReducer, useEffect, useMemo } from 'react';
import { createEnvironment } from '~/environment';
import { getConfig } from '~/config';
import { Address, DeploymentOutput, DeployedEnvironment, sameAddress } from '@melonproject/melonjs';
import { NetworkEnum } from '~/types';
import { Eth } from 'web3-eth';
import { IconName } from '~/storybook/Icons/Icons';
import { map } from 'rxjs/operators';

export enum ConnectionStatus {
  OFFLINE,
  CONNECTING,
  CONNECTED,
}

export interface ConnectionState {
  deployment?: DeploymentOutput;
  eth?: Eth;
  network?: NetworkEnum;
  accounts?: Address[];
  account?: Address;
  method?: string;
  error?: Error;
}

export enum ConnectionActionType {
  METHOD_CHANGED,
  CONNECTION_ESTABLISHED,
  CONNECTION_LOST,
  NETWORK_CHANGED,
  ACCOUNTS_CHANGED,
  ACCOUNT_CHANGED,
  DEPLOYMENT_LOADING,
  DEPLOYMENT_LOADED,
  DEPLOYMENT_ERROR,
}

export type ConnectionAction =
  | MethodChanged
  | ConnectionEstablished
  | ConnectionLost
  | AccountsChanged
  | AccountChanged
  | NetworkChanged
  | DeploymentLoading
  | DeploymentLoaded
  | DeploymentError;

export interface MethodChanged {
  type: ConnectionActionType.METHOD_CHANGED;
  method: string;
}

export interface ConnectionEstablished {
  type: ConnectionActionType.CONNECTION_ESTABLISHED;
  eth: Eth;
  network?: NetworkEnum;
  accounts?: Address[];
}

export interface ConnectionLost {
  type: ConnectionActionType.CONNECTION_LOST;
}

export interface AccountsChanged {
  type: ConnectionActionType.ACCOUNTS_CHANGED;
  accounts?: Address[];
}

export interface AccountChanged {
  type: ConnectionActionType.ACCOUNT_CHANGED;
  account?: Address;
}

export interface NetworkChanged {
  type: ConnectionActionType.NETWORK_CHANGED;
  network?: NetworkEnum;
}

export interface DeploymentLoading {
  type: ConnectionActionType.DEPLOYMENT_LOADING;
}

export interface DeploymentLoaded {
  type: ConnectionActionType.DEPLOYMENT_LOADED;
  deployment: DeploymentOutput;
}

export interface DeploymentError {
  type: ConnectionActionType.DEPLOYMENT_ERROR;
  error: Error;
}

export function accountsChanged(accounts?: Address[]): AccountsChanged {
  return { accounts, type: ConnectionActionType.ACCOUNTS_CHANGED };
}

export function accountChanged(account?: Address): AccountChanged {
  return { account, type: ConnectionActionType.ACCOUNT_CHANGED };
}

export function networkChanged(network?: NetworkEnum): NetworkChanged {
  return { network, type: ConnectionActionType.NETWORK_CHANGED };
}

export function methodChanged(method: string): MethodChanged {
  return { method, type: ConnectionActionType.METHOD_CHANGED };
}

export function connectionEstablished(eth: Eth, network?: NetworkEnum, accounts?: Address[]): ConnectionEstablished {
  return { eth, network, accounts, type: ConnectionActionType.CONNECTION_ESTABLISHED };
}

export function connectionLost(): ConnectionLost {
  return { type: ConnectionActionType.CONNECTION_LOST };
}

export function deploymentLoading(): DeploymentLoading {
  return { type: ConnectionActionType.DEPLOYMENT_LOADING };
}

export function deploymentLoaded(deployment: DeploymentOutput): DeploymentLoaded {
  return { deployment, type: ConnectionActionType.DEPLOYMENT_LOADED };
}

export function deploymentError(error: Error): DeploymentError {
  return { error, type: ConnectionActionType.DEPLOYMENT_ERROR };
}

function init(props: ConnectionProviderProps): ConnectionState {
  const common = {
    network: undefined,
    deployment: undefined,
    account: undefined,
    accounts: undefined,
    method: undefined,
  };

  const validUntil = parseInt(window.localStorage.getItem('connection.validity') || '0', 10);
  const storedMethod = window.localStorage.getItem('connection.method');
  const storedAccount = window.localStorage.getItem('connection.account') || undefined;

  if (!!validUntil && Date.now() <= validUntil) {
    if (!!storedMethod && props.methods.some((method) => method.name === storedMethod)) {
      return {
        ...common,
        method: storedMethod,
        account: storedAccount,
      };
    }
  }

  // Fall back to the default connection method if the selected values are no longer valid.
  return {
    ...common,
    method: props.default.name,
  };
}

export function reducer(state: ConnectionState, action: ConnectionAction): ConnectionState {
  switch (action.type) {
    case ConnectionActionType.METHOD_CHANGED: {
      return {
        ...state,
        network: undefined,
        deployment: undefined,
        account: undefined,
        accounts: undefined,
        method: action.method,
      };
    }

    case ConnectionActionType.NETWORK_CHANGED: {
      const identical = state.network === action.network;
      const deployment = identical ? state.deployment : undefined;
      const account = identical ? state.account : undefined;
      const accounts = identical ? state.accounts : undefined;
      return { ...state, account, accounts, deployment, network: action.network };
    }

    case ConnectionActionType.ACCOUNTS_CHANGED: {
      const accounts = action.accounts || [];
      const account = (state.account && accounts.find((address) => sameAddress(address, state.account))) || accounts[0];
      return { ...state, account, accounts };
    }

    case ConnectionActionType.ACCOUNT_CHANGED: {
      if (!(state.accounts || []).find((address) => sameAddress(address, action.account))) {
        throw new Error('Invalid account selected.');
      }

      return { ...state, account: action.account };
    }

    case ConnectionActionType.CONNECTION_ESTABLISHED: {
      const accounts = action.accounts || [];
      const account = (state.account && accounts.find((address) => sameAddress(address, state.account))) || accounts[0];
      return { ...state, account, network: action.network, accounts: action.accounts, eth: action.eth };
    }

    case ConnectionActionType.CONNECTION_LOST: {
      return {
        ...state,
        network: undefined,
        account: undefined,
        accounts: undefined,
        eth: undefined,
        method: undefined,
      };
    }

    case ConnectionActionType.DEPLOYMENT_LOADING: {
      return state;
    }

    case ConnectionActionType.DEPLOYMENT_LOADED: {
      return { ...state, deployment: action.deployment };
    }

    case ConnectionActionType.DEPLOYMENT_ERROR: {
      return { ...state, deployment: undefined, error: action.error };
    }

    default: {
      throw new Error('Invalid action.');
    }
  }
}

export interface ConnectionContext {
  environment?: DeployedEnvironment;
  network?: NetworkEnum;
  accounts?: Address[];
  account?: Address;
  method?: string;
  status: ConnectionStatus;
  methods: ConnectionMethod[];
  switch: (account?: Address) => void;
  connect: (method: string) => void;
  disconnect: () => void;
}

export const Connection = createContext<ConnectionContext>({} as ConnectionContext);

export interface ConnectionMethodProps {
  connect: () => void;
  disconnect: () => void;
  active: boolean;
}

export interface ConnectionMethod {
  name: string;
  label: string;
  icon?: IconName;
  component: React.ComponentType<ConnectionMethodProps>;
  connect: () => Rx.Observable<ConnectionAction>;
  supported: () => boolean;
}

export interface ConnectionProviderProps {
  methods: ConnectionMethod[];
  default: ConnectionMethod;
  disconnect: ConnectionMethod;
}

export const ConnectionProvider: React.FC<ConnectionProviderProps> = (props) => {
  const [state, dispatch] = useReducer<React.Reducer<ConnectionState, ConnectionAction>, ConnectionProviderProps>(
    reducer,
    props,
    init
  );

  useEffect(() => {
    // Update the validity timestamp every 10 seconds. We automatically re-connect to the previously
    // selected connection method if the site is reloaded within the max. validity time span.
    const observable$ = Rx.timer(0, 10000).pipe(
      map(() => {
        // Set the validity to one hour in development.
        if (process.env.NODE_ENV === 'development') {
          return Date.now() + 3600000;
        }

        // Set the validity to 60 seconds in production.
        return Date.now() + 60000;
      })
    );
    const subscription = observable$.subscribe((now) => {
      window.localStorage.setItem('connection.validity', `${now}`);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!state.method) {
      window.localStorage.removeItem('connection.method');
    } else {
      window.localStorage.setItem('connection.method', state.method);
    }
  }, [state.method]);

  useEffect(() => {
    if (state.account) {
      window.localStorage.setItem('connection.account', state.account);
    } else {
      window.localStorage.removeItem('connection.account');
    }
  }, [state.account]);

  // Subscribe to the current connection method's observable whenever it changes.
  useEffect(() => {
    const method =
      [...props.methods, props.default, props.disconnect].find((item) => item.name === state.method) ?? props.default;
    const observable = method.connect();
    const subscription = observable.subscribe({
      next: (action) => dispatch(action),
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [props.methods, props.default, state.method]);

  // Load the deployment based on the current network whenever it changes.
  useEffect(() => {
    const config = getConfig(state.network);
    if (!config?.deployment) {
      return;
    }

    dispatch(deploymentLoading());

    const subscription = Rx.from(config.deployment()).subscribe({
      next: (deployment) => dispatch(deploymentLoaded(deployment)),
      error: (error) => dispatch(deploymentError(error)),
    });

    return () => subscription.unsubscribe();
  }, [state.network]);

  const status = useMemo(() => {
    if (state.network == null || state.network === NetworkEnum.UNSUPPORTED) {
      return ConnectionStatus.OFFLINE;
    }

    if (state.network && state.deployment) {
      return ConnectionStatus.CONNECTED;
    }

    if (state.method) {
      return ConnectionStatus.CONNECTING;
    }

    return ConnectionStatus.OFFLINE;
  }, [state.network, state.method, state.deployment]);

  // Create the environment once the required values are available.
  const environment = useMemo(() => {
    if (state.network == null || state.network === NetworkEnum.UNSUPPORTED) {
      return undefined;
    }

    const config = getConfig(state.network);
    if (state.eth && state.network && state.deployment && config) {
      return createEnvironment(state.eth, state.deployment, state.network, config);
    }

    return undefined;
  }, [state.eth, state.network, state.deployment]);

  const disconnect = props.disconnect.name;
  const context: ConnectionContext = {
    environment,
    status,
    network: state.network,
    account: state.account,
    accounts: state.accounts,
    method: state.method,
    methods: props.methods,
    switch: (account?: Address) => dispatch(accountChanged(account)),
    connect: (method: string) => dispatch(methodChanged(method)),
    disconnect: () => dispatch(methodChanged(disconnect)),
  };

  return <Connection.Provider value={context}>{props.children}</Connection.Provider>;
};
