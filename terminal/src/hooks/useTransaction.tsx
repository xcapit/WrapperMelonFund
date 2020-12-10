import React, { useEffect, useReducer } from 'react';
import { TransactionReceipt } from 'web3-core';
import {
  Transaction,
  SendOptions,
  Deployment,
  Contract,
  DeployedEnvironment,
  ValidationError as TransactionValidationError,
} from '@melonproject/melonjs';
import { NetworkEnum } from '~/types';
import BigNumber from 'bignumber.js';
import { useOnChainQueryRefetcher } from './useOnChainQueryRefetcher';

export interface TransactionError extends Error {
  customMessage?: string;
  dismiss?: boolean;
  issueUri?: string;
}

export interface TransactionState {
  progress: number;
  sendOptions?: SendOptions;
  defaultGasPrice?: number;
  ethGasStation?: EthGasStation;
  transaction?: Transaction;
  name?: string;
  hash?: string;
  receipt?: TransactionReceipt;
  error?: TransactionError;
  loading: boolean;
  handled?: string;
}

export enum TransactionProgress {
  TRANSACTION_WAITING,
  TRANSACTION_CANCELLED,
  TRANSACTION_STARTED,
  VALIDATION_ERROR,
  VALIDATION_PENDING,
  VALIDATION_FINISHED,
  ESTIMATION_ERROR,
  ESTIMATION_PENDING,
  ESTIMATION_FINISHED,
  EXECUTION_ERROR,
  EXECUTION_PENDING,
  EXECUTION_RECEIVED,
  EXECUTION_FINISHED,
  TRANSACTION_ACKNOWLEDGED,
}

type TransactionAction =
  | TransactionStarted
  | TransactionCancelled
  | TransactionAcknowledged
  | ValidationPending
  | ValidationFinished
  | ValidationError
  | EstimationPending
  | EstimationFinished
  | EstimationError
  | ExecutionPending
  | ExecutionReceived
  | ExecutionFinished
  | ExecutionError;

interface TransactionStarted {
  type: TransactionProgress.TRANSACTION_STARTED;
  transaction: Transaction;
  name: string;
}

interface TransactionCancelled {
  type: TransactionProgress.TRANSACTION_CANCELLED;
}

interface TransactionAcknowledged {
  type: TransactionProgress.TRANSACTION_ACKNOWLEDGED;
}

interface EstimationPending {
  type: TransactionProgress.ESTIMATION_PENDING;
}

interface EstimationFinished {
  type: TransactionProgress.ESTIMATION_FINISHED;
  defaultGasPrice: number;
  sendOptions: SendOptions;
  ethGasStation?: EthGasStation;
}

interface EstimationError {
  type: TransactionProgress.ESTIMATION_ERROR;
  error: Error;
}

interface ValidationPending {
  type: TransactionProgress.VALIDATION_PENDING;
}

interface ValidationFinished {
  type: TransactionProgress.VALIDATION_FINISHED;
}

interface ValidationError {
  type: TransactionProgress.VALIDATION_ERROR;
  error: TransactionError;
  handled?: string;
}

interface ExecutionPending {
  type: TransactionProgress.EXECUTION_PENDING;
  sendOptions: SendOptions;
}

interface ExecutionReceived {
  type: TransactionProgress.EXECUTION_RECEIVED;
  hash: string;
}

interface ExecutionFinished {
  type: TransactionProgress.EXECUTION_FINISHED;
  receipt: TransactionReceipt;
}

interface ExecutionError {
  type: TransactionProgress.EXECUTION_ERROR;
  error: TransactionError;
  handled?: string;
}

export interface EthGasStation {
  fast: number;
  low: number;
  average: number;
}

function reducer(state: TransactionState, action: TransactionAction): TransactionState {
  if (
    state.progress === TransactionProgress.TRANSACTION_CANCELLED &&
    action.type !== TransactionProgress.TRANSACTION_STARTED
  ) {
    return state;
  }

  switch (action.type) {
    case TransactionProgress.TRANSACTION_STARTED:
      return {
        ...state,
        progress: TransactionProgress.TRANSACTION_STARTED,
        transaction: action.transaction,
        name: action.name,
        error: undefined,
        handled: undefined,
        hash: undefined,
        receipt: undefined,
        defaultGasPrice: undefined,
        ethGasStation: undefined,
        sendOptions: undefined,
        loading: true,
      };

    case TransactionProgress.TRANSACTION_CANCELLED:
      return {
        ...state,
        progress: TransactionProgress.TRANSACTION_CANCELLED,
        transaction: undefined,
        name: undefined,
        error: undefined,
        handled: undefined,
        hash: undefined,
        receipt: undefined,
        defaultGasPrice: undefined,
        ethGasStation: undefined,
        sendOptions: undefined,
        loading: false,
      };

    case TransactionProgress.TRANSACTION_ACKNOWLEDGED: {
      return {
        ...state,
        progress: TransactionProgress.TRANSACTION_ACKNOWLEDGED,
      };
    }

    case TransactionProgress.VALIDATION_PENDING: {
      return {
        ...state,
        progress: TransactionProgress.VALIDATION_PENDING,
        loading: true,
        error: undefined,
        handled: undefined,
      };
    }

    case TransactionProgress.VALIDATION_ERROR: {
      return {
        ...state,
        progress: TransactionProgress.VALIDATION_ERROR,
        loading: false,
        error: action.error,
        handled: action.handled,
      };
    }

    case TransactionProgress.VALIDATION_FINISHED:
      return {
        ...state,
        progress: TransactionProgress.VALIDATION_FINISHED,
        loading: false,
      };

    case TransactionProgress.ESTIMATION_PENDING: {
      return {
        ...state,
        progress: TransactionProgress.ESTIMATION_PENDING,
        loading: true,
        error: undefined,
      };
    }

    case TransactionProgress.ESTIMATION_ERROR: {
      return {
        ...state,
        progress: TransactionProgress.ESTIMATION_ERROR,
        loading: false,
        error: action.error,
      };
    }

    case TransactionProgress.ESTIMATION_FINISHED:
      return {
        ...state,
        progress: TransactionProgress.ESTIMATION_FINISHED,
        loading: false,
        defaultGasPrice: action.defaultGasPrice,
        sendOptions: action.sendOptions,
        ethGasStation: action.ethGasStation,
      };

    case TransactionProgress.EXECUTION_PENDING: {
      return {
        ...state,
        progress: TransactionProgress.EXECUTION_PENDING,
        sendOptions: action.sendOptions,
        loading: true,
        error: undefined,
        handled: undefined,
        hash: undefined,
      };
    }

    case TransactionProgress.EXECUTION_RECEIVED: {
      return {
        ...state,
        progress: TransactionProgress.EXECUTION_RECEIVED,
        hash: action.hash,
      };
    }

    case TransactionProgress.EXECUTION_FINISHED: {
      return {
        ...state,
        progress: TransactionProgress.EXECUTION_FINISHED,
        loading: false,
        receipt: action.receipt,
      };
    }

    case TransactionProgress.EXECUTION_ERROR: {
      return {
        ...state,
        progress: TransactionProgress.EXECUTION_ERROR,
        loading: false,
        error: { ...action.error, message: 'The transaction has failed. This is an error.' },
        handled: action.handled,
      };
    }

    default:
      throw new Error('Invalid action.');
  }
}

function validationPending(dispatch: React.Dispatch<TransactionAction>) {
  dispatch({ type: TransactionProgress.VALIDATION_PENDING });
}

function validationFinished(dispatch: React.Dispatch<TransactionAction>) {
  dispatch({ type: TransactionProgress.VALIDATION_FINISHED });
}

function validationError(dispatch: React.Dispatch<TransactionAction>, error: TransactionError, handled?: string) {
  dispatch({ error, handled, type: TransactionProgress.VALIDATION_ERROR });
}

function estimationPending(dispatch: React.Dispatch<TransactionAction>) {
  dispatch({ type: TransactionProgress.ESTIMATION_PENDING });
}

function estimationFinished(
  dispatch: React.Dispatch<TransactionAction>,
  defaultGasPrice: number,
  sendOptions: SendOptions,
  ethGasStation?: EthGasStation
) {
  dispatch({ defaultGasPrice, sendOptions, ethGasStation, type: TransactionProgress.ESTIMATION_FINISHED });
}

function estimationError(dispatch: React.Dispatch<TransactionAction>, error: Error) {
  dispatch({ error, type: TransactionProgress.ESTIMATION_ERROR });
}

function executionPending(dispatch: React.Dispatch<TransactionAction>, sendOptions: SendOptions) {
  dispatch({ sendOptions, type: TransactionProgress.EXECUTION_PENDING });
}

function executionReceived(dispatch: React.Dispatch<TransactionAction>, hash: string) {
  dispatch({ hash, type: TransactionProgress.EXECUTION_RECEIVED });
}

function executionFinished(dispatch: React.Dispatch<TransactionAction>, receipt: TransactionReceipt) {
  dispatch({ receipt, type: TransactionProgress.EXECUTION_FINISHED });
}

function executionError(dispatch: React.Dispatch<TransactionAction>, error: TransactionError, handled?: string) {
  dispatch({ error, handled, type: TransactionProgress.EXECUTION_ERROR });
}

export interface TransactionOptions {
  onStart?: () => void;
  onFinish?: (receipt: TransactionReceipt) => void;
  onAcknowledge?: (receipt: TransactionReceipt) => void;
  onError?: (error: Error) => void;
  handleError?: (error?: Error, validationError?: TransactionValidationError) => string | void;
}

export interface TransactionHookValues {
  state: TransactionState;
  submit: (gasPrice: BigNumber.Value) => Promise<void>;
  start: <T extends Contract = Contract>(transaction: Transaction | Deployment<T>, name: string) => void;
  cancel: () => void;
  acknowledge: () => void;
}

async function fetchEthGasStation(environment: DeployedEnvironment) {
  const network = environment.network as NetworkEnum;
  if (network !== NetworkEnum.MAINNET) {
    return undefined;
  }

  try {
    const result = await fetch('https://ethgasstation.info/json/ethgasAPI.json');
    const json = await result.json();

    return {
      fast: json.fast / 10,
      low: json.safeLow / 10,
      average: json.average / 10,
    };
  } catch (error) {
    return undefined;
  }
}

export function useTransaction(environment: DeployedEnvironment, options?: TransactionOptions) {
  const [state, dispatch] = useReducer(reducer, {
    progress: TransactionProgress.TRANSACTION_WAITING,
    transaction: undefined,
    name: undefined,
    hash: undefined,
    receipt: undefined,
    error: undefined,
    handled: undefined,
    loading: false,
  } as TransactionState);

  const refetch = useOnChainQueryRefetcher();

  const start = (transaction: Transaction, name: string) => {
    dispatch({ transaction, name, type: TransactionProgress.TRANSACTION_STARTED });
  };

  const cancel = () => {
    dispatch({ type: TransactionProgress.TRANSACTION_CANCELLED });
  };

  const acknowledge = () => {
    dispatch({ type: TransactionProgress.TRANSACTION_ACKNOWLEDGED });
  };

  const submit = async (gasPrice: BigNumber.Value) => {
    if (!(state.transaction && state.sendOptions)) {
      return;
    }

    const transaction = state.transaction!;
    const opts: SendOptions = {
      gasPrice: new BigNumber(gasPrice).multipliedBy('1e9').decimalPlaces(0).toFixed(),
      ...(state.sendOptions && state.sendOptions.gas && { gas: state.sendOptions.gas }),
      ...(state.sendOptions && state.sendOptions.amgu && { amgu: state.sendOptions.amgu }),
      ...(state.sendOptions && state.sendOptions.incentive && { incentive: state.sendOptions.incentive }),
    };

    // on-submit validation
    try {
      const transaction = state.transaction!;
      await Promise.all([transaction.validate(), transaction.checkEthBalance({ from: transaction.from, ...opts })]);
    } catch (error) {
      const handled = await (options?.handleError && options.handleError(error));
      validationError(dispatch, error, handled || undefined);
      return;
    }

    // actual submit
    try {
      executionPending(dispatch, opts);
      const tx = transaction.send(opts);
      const receipt = await new Promise<TransactionReceipt>((resolve, reject) => {
        tx.once('transactionHash', (hash) => executionReceived(dispatch, hash));
        tx.once('receipt', (receipt) => resolve(receipt));
        tx.once('error', (error) => reject((error as any).error ? (error as any).error : error));
      });

      await refetch(receipt.blockNumber);
      executionFinished(dispatch, receipt);
      await (options?.onFinish && options.onFinish(receipt));
    } catch (error) {
      // post-error validation
      await refetch(error.blockNumber);

      try {
        const transaction = state.transaction!;
        await transaction.validate();
        const handled = await (options?.handleError && options.handleError(error));
        executionError(dispatch, error, handled || undefined);
      } catch (validationError) {
        const handled = await (options?.handleError && options.handleError(error, validationError));
        executionError(dispatch, validationError, handled || undefined);
        return;
      }
    }
  };

  useEffect(() => {
    switch (state.progress) {
      case TransactionProgress.TRANSACTION_ACKNOWLEDGED: {
        options?.onAcknowledge && options.onAcknowledge(state.receipt!);
        break;
      }

      case TransactionProgress.EXECUTION_ERROR:
      case TransactionProgress.ESTIMATION_ERROR:
      case TransactionProgress.VALIDATION_ERROR: {
        options?.onError && options.onError(state.error!);
        break;
      }

      // Automatically start validation when the modal is opened (pre-submit validation)
      case TransactionProgress.TRANSACTION_STARTED: {
        options?.onStart && options.onStart();

        (async () => {
          try {
            validationPending(dispatch);

            const transaction = state.transaction!;
            await transaction.validate();

            validationFinished(dispatch);
          } catch (error) {
            const handled = await (options?.handleError && options.handleError(error));
            validationError(dispatch, error, handled || undefined);
          }
        })();
        break;
      }

      // Automatically start estimation when validation is finished.
      case TransactionProgress.VALIDATION_FINISHED: {
        (async () => {
          try {
            estimationPending(dispatch);
            const [ethGasStation, onChainPrice, sendOptions] = await Promise.all([
              fetchEthGasStation(environment),
              environment.client.getGasPrice(),
              state.transaction!.prepare(),
            ])!;

            const defaultGasPrice = ethGasStation ? ethGasStation.average : +onChainPrice! / 1e9;
            estimationFinished(dispatch, defaultGasPrice, sendOptions!, ethGasStation);
          } catch (error) {
            estimationError(dispatch, error);
          }
        })();
        break;
      }
    }
  }, [state.progress]);

  return {
    state,
    submit,
    start,
    cancel,
    acknowledge,
  } as TransactionHookValues;
}
