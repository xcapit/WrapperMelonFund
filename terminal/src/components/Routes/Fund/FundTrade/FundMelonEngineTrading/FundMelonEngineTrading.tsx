import React, { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { ExchangeDefinition, MelonEngineTradingAdapter, TokenDefinition, Trading } from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Button } from '~/components/Form/Button/Button';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { useMelonEngineTradingQuery } from './FundMelonEngineTrading.query';
import { Holding, Token, Policy } from '@melonproject/melongql';
import { toTokenBaseUnit } from '~/utils/toTokenBaseUnit';
import { useAccount } from '~/hooks/useAccount';
import { Subtitle } from '~/storybook/Title/Title';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { TransactionDescription } from '~/components/Common/TransactionModal/TransactionDescription';
import { validatePolicies } from '../validatePolicies';
import { Error } from '~/components/Form/Form';
import { NotificationBar, NotificationContent } from '~/storybook/NotificationBar/NotificationBar';

export interface FundMelonEngineTradingProps {
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

export const FundMelonEngineTrading: React.FC<FundMelonEngineTradingProps> = (props) => {
  const [price, liquid, query] = useMelonEngineTradingQuery();
  const environment = useEnvironment()!;
  const account = useAccount()!;
  const transaction = useTransaction(environment);
  const [errors, setErrors] = React.useState<string[]>([]);

  const loading = query.loading;
  const value = props.quantity.multipliedBy(price ?? new BigNumber('NaN'));
  const valid = !value.isNaN() && !value.isZero() && value.isLessThanOrEqualTo(liquid);
  const rate = valid ? price : new BigNumber('NaN');
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
    const adapter = await MelonEngineTradingAdapter.create(environment, props.exchange.adapter, trading);
    const tx = adapter.takeOrder(account.address!, {
      makerAsset: props.maker.address,
      takerAsset: props.taker.address,
      makerQuantity: toTokenBaseUnit(value, props.maker.decimals),
      takerQuantity: toTokenBaseUnit(props.quantity, props.taker.decimals),
    });

    transaction.start(tx, 'Take order on the Melon engine');
  };

  return (
    <>
      <Subtitle>
        Melon Engine (<FormattedNumber value={1} suffix={props.taker.symbol} decimals={0} /> ={' '}
        <FormattedNumber value={rate} suffix={props.maker.symbol} />)
      </Subtitle>

      <Button type="button" disabled={!ready || !props.active} loading={loading} onClick={submit}>
        {loading ? (
          ''
        ) : valid ? (
          <>
            Buy <FormattedNumber value={value} suffix={props.maker.symbol} />
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
        <TransactionDescription title="Take order on the Melon engine">
          You are selling{' '}
          <FormattedNumber
            value={props.quantity}
            suffix={props.taker.symbol}
            decimals={4}
            tooltip={true}
            tooltipDecimals={props.taker.decimals}
          />{' '}
          to the Melon Engine, in exchange for{' '}
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
