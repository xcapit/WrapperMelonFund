import { Holding, Policy, Token } from '@melonproject/melongql';
import {
  ExchangeDefinition,
  sameAddress,
  TokenDefinition,
  Trading,
  UniswapExchange,
  UniswapFactory,
  UniswapTradingAdapter,
} from '@melonproject/melonjs';
import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import * as Rx from 'rxjs';
import { catchError, expand, map, switchMapTo } from 'rxjs/operators';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { TransactionDescription } from '~/components/Common/TransactionModal/TransactionDescription';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { useAccount } from '~/hooks/useAccount';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { Button } from '~/components/Form/Button/Button';
import { toTokenBaseUnit } from '~/utils/toTokenBaseUnit';
import { validatePolicies } from '../validatePolicies';
import { NotificationBar, NotificationContent } from '~/storybook/NotificationBar/NotificationBar';
import { Subtitle } from '~/storybook/Title/Title';

export interface FundUniswapTradingProps {
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

export const FundUniswapTrading: React.FC<FundUniswapTradingProps> = (props) => {
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
      const uniswapFactory = new UniswapFactory(environment, environment.deployment.uniswap.addr.UniswapFactory);
      const takerQty = toTokenBaseUnit(props.quantity, props.taker.decimals);

      if (sameAddress(props.taker.address, weth.address)) {
        // Convert WETH into token.
        const exchangeAddress = await uniswapFactory.getExchange(props.maker.address);
        const exchange = new UniswapExchange(environment, exchangeAddress);
        const makerQty = await exchange.getEthToTokenInputPrice(takerQty);
        return makerQty.dividedBy(takerQty);
      }

      if (sameAddress(props.maker.address, weth.address)) {
        // Convert token into WETH.
        const exchangeAddress = await uniswapFactory.getExchange(props.taker.address);
        const exchange = new UniswapExchange(environment, exchangeAddress);
        const makerQty = await exchange.getTokenToEthInputPrice(takerQty);
        return makerQty.dividedBy(takerQty);
      }

      // Convert token into token.
      const [sourceExchangeAddress, targetExchangeAddress] = await Promise.all([
        uniswapFactory.getExchange(props.taker.address),
        uniswapFactory.getExchange(props.maker.address),
      ]);

      const sourceExchange = new UniswapExchange(environment, sourceExchangeAddress);
      const targetExchange = new UniswapExchange(environment, targetExchangeAddress);
      const intermediateEth = await sourceExchange.getTokenToEthInputPrice(takerQty);
      const makerQty = await targetExchange.getEthToTokenInputPrice(intermediateEth);
      return makerQty.dividedBy(takerQty);
    });

    // Refetch every 5 seconds.
    const polling$ = fetch$.pipe(expand(() => Rx.timer(5000).pipe(switchMapTo(fetch$))));
    const observable$ = polling$.pipe(
      map((value) =>
        value.multipliedBy(new BigNumber(10).exponentiatedBy(props.taker.decimals - props.maker.decimals))
      ),
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
    const adapter = await UniswapTradingAdapter.create(environment, props.exchange.adapter, trading);

    const tx = adapter.takeOrder(account.address!, {
      makerQuantity: toTokenBaseUnit(value, props.maker.decimals),
      takerQuantity: toTokenBaseUnit(props.quantity, props.taker.decimals),
      makerAsset: props.maker.address,
      takerAsset: props.taker.address,
    });

    transaction.start(tx, 'Take order');
  };

  return (
    <>
      <Subtitle>
        Uniswap (<FormattedNumber value={1} suffix={state.taker.symbol} decimals={0} /> ={' '}
        <FormattedNumber value={rate} suffix={state.maker.symbol} />)
      </Subtitle>
      <Button type="button" disabled={!ready || !props.active} loading={loading} onClick={submit}>
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
        <TransactionDescription title="Take order on Uniswap">
          You are selling{' '}
          <FormattedNumber
            value={props.quantity}
            suffix={props.taker.symbol}
            decimals={4}
            tooltip={true}
            tooltipDecimals={props.taker.decimals}
          />{' '}
          through Uniswap, in exchange for{' '}
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
