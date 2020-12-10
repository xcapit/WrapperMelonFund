import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import * as Rx from 'rxjs';
import {
  TokenDefinition,
  KyberNetworkProxy,
  Trading,
  KyberTradingAdapter,
  ExchangeDefinition,
  sameAddress,
} from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccount } from '~/hooks/useAccount';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { toTokenBaseUnit } from '~/utils/toTokenBaseUnit';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';
import { Holding, Token, Policy } from '@melonproject/melongql';
import { Button } from '~/components/Form/Button/Button';
import { catchError, map, expand, switchMapTo } from 'rxjs/operators';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { TransactionDescription } from '~/components/Common/TransactionModal/TransactionDescription';
import { validatePolicies } from '../validatePolicies';
import { Error } from '~/components/Form/Form';
import { NotificationBar, NotificationContent } from '~/storybook/NotificationBar/NotificationBar';
import { Subtitle } from '~/storybook/Title/Title';

export interface FundKyberTradingProps {
  trading: string;
  exchange: ExchangeDefinition;
  holdings: Holding[];
  denominationAsset?: Token;
  policies?: Policy[];
  maker: TokenDefinition;
  taker: TokenDefinition;
  quantity: BigNumber;
  active: boolean;
}

export const FundKyberTrading: React.FC<FundKyberTradingProps> = (props) => {
  const [state, setState] = useState(() => ({
    rate: new BigNumber('NaN'),
    maker: props.maker,
    taker: props.taker,
    quantity: props.quantity,
    state: 'loading',
  }));
  const [errors, setErrors] = React.useState<string[]>([]);
  const environment = useEnvironment()!;
  const account = useAccount()!;

  const transaction = useTransaction(environment, {
    handleError: () => 'The price may have moved before the order was confirmed. Please try again.',
  });

  useEffect(() => {
    setState((previous) => ({
      ...previous,
      maker: props.maker,
      taker: props.taker,
      quantity: props.quantity,
      state: 'loading',
      // Reset the rate if the maker or taker have changed.
      ...(!(props.maker === state.maker && props.taker === state.taker) && { rate: new BigNumber('NaN') }),
    }));

    const fetch$ = Rx.defer(async () => {
      const weth = environment.getToken('WETH');
      const contract = new KyberNetworkProxy(environment, environment.deployment.kyber.addr.KyberNetworkProxy);
      const kyberEth = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
      const srcToken = sameAddress(props.taker.address, weth.address) ? kyberEth : props.taker.address;
      const destToken = sameAddress(props.maker.address, weth.address) ? kyberEth : props.maker.address;
      const srcQty = toTokenBaseUnit(props.quantity, props.taker.decimals);
      const expected = await contract.getExpectedRate(srcToken, destToken, srcQty);

      return expected.expectedRate;
    });

    // Refetch every 5 seconds.
    const polling$ = fetch$.pipe(expand(() => Rx.timer(5000).pipe(switchMapTo(fetch$))));
    const observable$ = polling$.pipe(
      map((value) => fromTokenBaseUnit(value, 18)),
      catchError(() => Rx.of(new BigNumber('NaN')))
    );

    const subscription = observable$.subscribe((rate) => {
      setState((previous) => ({
        ...previous,
        rate,
        state: 'idle',
      }));
    });

    return () => subscription.unsubscribe();
  }, [props.maker, props.taker, props.quantity.valueOf()]);

  const value = props.quantity.multipliedBy(state.rate);
  const valid = !value.isNaN() && !value.isZero();
  const rate = valid ? state.rate : new BigNumber('NaN');
  const loading = state.state === 'loading';
  const ready = !loading && valid;

  const submit = async () => {
    const errors = await validatePolicies({
      environment,
      makerAmount: value,
      policies: props.policies,
      taker: props.taker,
      maker: props.maker,
      holdings: props.holdings,
      denominationAsset: props.denominationAsset,
      takerAmount: props.quantity,
      tradingAddress: props.trading,
    });

    setErrors(errors);

    if (errors.length) {
      return;
    }

    const trading = new Trading(environment, props.trading);
    const adapter = await KyberTradingAdapter.create(environment, props.exchange.adapter, trading);

    const tx = adapter.takeOrder(account.address!, {
      makerQuantity: toTokenBaseUnit(value, props.maker.decimals),
      takerQuantity: toTokenBaseUnit(props.quantity, props.taker.decimals),
      makerAsset: props.maker.address,
      takerAsset: props.taker.address,
    });

    transaction.start(tx, 'Take order on Kyber');
  };

  return (
    <>
      <Subtitle>
        Kyber Network (<FormattedNumber value={1} suffix={state.taker.symbol} decimals={0} /> ={' '}
        <FormattedNumber value={rate} suffix={state.maker.symbol} />)
      </Subtitle>

      <Button type="button" disabled={!ready || !props.active || !!errors.length} loading={loading} onClick={submit}>
        {loading ? (
          ''
        ) : valid ? (
          <>
            Buy <FormattedNumber value={value} suffix={state.maker.symbol} />
          </>
        ) : (
          'No Offer'
        )}
      </Button>
      {!!errors.length && (
        <NotificationBar kind="error">
          <NotificationContent>{errors.join('\n')}</NotificationContent>
        </NotificationBar>
      )}

      <TransactionModal transaction={transaction}>
        <TransactionDescription title="Take order on Kyber">
          You are selling{' '}
          <FormattedNumber
            value={props.quantity}
            suffix={props.taker.symbol}
            decimals={4}
            tooltip={true}
            tooltipDecimals={props.taker.decimals}
          />{' '}
          through Kyber, in exchange for{' '}
          <FormattedNumber
            value={value}
            suffix={props.maker.symbol}
            decimals={4}
            tooltip={true}
            tooltipDecimals={props.maker.decimals}
          />
        </TransactionDescription>
      </TransactionModal>
    </>
  );
};
