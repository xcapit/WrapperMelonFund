import { SignedOrder } from '@0x/order-utils';
import { Holding, Policy, Token } from '@melonproject/melongql';
import {
  ExchangeDefinition,
  ExchangeIdentifier,
  OasisDexExchange,
  OasisDexTradingAdapter,
  sameAddress,
  TokenDefinition,
  Trading,
  ZeroExV3TradingAdapter,
} from '@melonproject/melonjs';
import BigNumber from 'bignumber.js';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { TokenValueDisplay } from '~/components/Common/TokenValueDisplay/TokenValueDisplay';
import { TransactionDescription } from '~/components/Common/TransactionModal/TransactionDescription';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { Form, FormikValues, useFormik } from '~/components/Form/Form';
import { TokenValueInput } from '~/components/Form/TokenValueInput/TokenValueInput';
import { useAccount } from '~/hooks/useAccount';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { Button } from '~/components/Form/Button/Button';
import { NotificationBar, NotificationContent } from '~/storybook/NotificationBar/NotificationBar';
import { TokenValue } from '~/TokenValue';
import { tokenValueSchema } from '~/utils/formValidation';
import { OrderbookItem } from '../FundOrderbook/utils/aggregatedOrderbook';
import { OasisDexOrderbookItem } from '../FundOrderbook/utils/matchingMarketOrderbook';
import { validatePolicies } from '../validatePolicies';

export interface FundOrderbookMarketFormProps {
  trading: string;
  denominationAsset?: Token;
  asset: TokenDefinition;
  exchanges: ExchangeDefinition[];
  holdings: Holding[];
  policies?: Policy[];
  order?: OrderbookItem;
  unsetOrder: () => void;
}

interface FundOrderbookMarketFormValues {
  quantity: string;
  price: string;
  total: string;
}

const validationSchema = Yup.object().shape({
  taker: tokenValueSchema()
    .gt(0)
    .lte(Yup.ref('takerBalance'), 'The balance of your fund is too low for this trade.')
    .test('max-quantity', 'Maximum available order quantity exceeded.', function (value) {
      const order = (this.options.context as any).order as OrderbookItem;
      const sell = (this.options.context as any).sell as boolean;

      if (!sell) {
        return true;
      }

      const quantity = order?.quantity;
      return value.value.isLessThanOrEqualTo(quantity);
    }),
  maker: tokenValueSchema()
    .gt(0)
    .test('max-quantity', 'Maximum available order quantity exceeded.', function (value) {
      const order = (this.options.context as any).order as OrderbookItem;
      const sell = (this.options.context as any).sell as boolean;

      if (sell) {
        return true;
      }

      const quantity = order?.quantity;
      return !!value.value?.isLessThanOrEqualTo(quantity);
    }),
  takerBalance: tokenValueSchema().required(),
});

export const FundOrderbookMarketForm: React.FC<FundOrderbookMarketFormProps> = (props) => {
  const environment = useEnvironment()!;
  const account = useAccount()!;
  const transaction = useTransaction(environment, {
    onAcknowledge: () => props.unsetOrder(),
    handleError: () => 'The order may have been taken before it was confirmed. Please try again.',
  });

  const [errors, setErrors] = React.useState<string[]>([]);

  const nonZeroHoldings = useMemo(() => props.holdings.filter((holding) => !holding.amount?.isZero()), [
    props.holdings,
  ]);

  const exchange = useMemo(
    () => (props.exchanges.find((item) => item.id === props.order?.exchange) ?? props.exchanges[0]).id,
    [props.exchanges, props.order]
  );
  const sell = props.order?.side === 'bid';

  const quote = environment.getToken('WETH');
  const base = props.asset;

  const order = props.order;
  const price = props.order?.price.decimalPlaces(18) ?? new BigNumber('NaN');

  const validationContext = React.useMemo(() => ({ order, sell }), [order, sell]);

  const initialValues = {
    taker: new TokenValue(environment.getToken('WETH')),
    maker: new TokenValue(environment.getToken('DAI')),
    takerBalance: new TokenValue(environment.getToken('WETH')),
  };

  const formik = useFormik({
    validationSchema,
    validationContext,
    initialValues,
    onSubmit: () => submit(),
  });

  const taker = formik.values.taker;
  const maker = formik.values.maker;

  useEffect(() => {
    const baseAmount = order?.quantity ?? new BigNumber('NaN');
    const quoteAmount = baseAmount.multipliedBy(price);

    formik.setFieldValue('taker', new TokenValue(sell ? base : quote, sell ? baseAmount : quoteAmount));
    formik.setFieldValue('maker', new TokenValue(sell ? quote : base, sell ? quoteAmount : baseAmount));
  }, [order]);

  const takerBalance = useMemo(() => {
    const index = nonZeroHoldings.findIndex((holding) => sameAddress(holding.token?.address, taker?.token.address));
    const balance = index !== -1 ? (nonZeroHoldings[index].amount as BigNumber) : 0;
    return TokenValue.fromToken(taker.token, balance);
  }, [taker, nonZeroHoldings]);

  useLayoutEffect(() => {
    formik.setFieldValue('takerBalance', takerBalance);
  }, [takerBalance]);

  const submit = async () => {
    const errors = await validatePolicies({
      environment,
      policies: props.policies,
      taker: taker.token,
      maker: maker.token,
      takerAmount: taker.value!,
      makerAmount: maker.value!,
      holdings: props.holdings,
      denominationAsset: props.denominationAsset,
      tradingAddress: props.trading,
    });

    setErrors(errors);

    if (errors.length) {
      return;
    }

    const trading = new Trading(environment, props.trading);
    const exchange = environment.getExchange(order!.exchange);

    const takerQuantity = formik.values.taker.integer;

    if (exchange.id === ExchangeIdentifier.OasisDex) {
      const market = new OasisDexExchange(environment, exchange.exchange);
      const adapter = await OasisDexTradingAdapter.create(environment, exchange.adapter, trading);
      const offer = await market.getOffer((order as OasisDexOrderbookItem).order.id);
      const tx = adapter.takeOrder(account.address!, order!.order.id, offer, takerQuantity);
      return transaction.start(tx, 'Take order on OasisDEX');
    }

    if (order!.exchange === ExchangeIdentifier.ZeroExV3) {
      const adapter = await ZeroExV3TradingAdapter.create(environment, exchange.adapter, trading);
      const offer = order?.order.order as SignedOrder;
      const tx = adapter.takeOrder(account.address!, offer, takerQuantity);
      return transaction.start(tx, 'Take order on 0x');
    }
  };

  const changeTakerAmount = (after: TokenValue, before?: TokenValue) => {
    const makerAmount = sell ? after.value?.multipliedBy(price) : after.value?.dividedBy(price);

    formik.setFieldValue('maker', maker.setValue(makerAmount!.decimalPlaces(maker.token.decimals, BigNumber.ROUND_UP)));
  };

  const changeMakerAmount = (after: TokenValue, before?: TokenValue) => {
    const takerAmount = sell ? after.value?.dividedBy(price) : after.value?.multipliedBy(price);

    formik.setFieldValue('taker', taker.setValue(takerAmount!.decimalPlaces(maker.token.decimals, BigNumber.ROUND_UP)));
  };

  const ready = formik.isValid;

  const description =
    ready &&
    `Trade summary: ${sell ? 'Sell' : 'Buy'} ${(sell ? taker : maker)?.value?.decimalPlaces(4).toString()} ${
      base.symbol
    } at a price of ${price.decimalPlaces(4).toString()} ${quote.symbol} per ${base.symbol} for a total of ${(sell
      ? maker
      : taker
    )?.value
      ?.decimalPlaces(4)
      .toString()} ${quote.symbol} (through ${exchange})`;

  const presets = React.useMemo(
    () => [
      {
        label: 'Max',
        value: takerBalance.integer ?? 0,
      },
    ],
    [takerBalance]
  );

  return (
    <Form formik={formik}>
      {order && (
        <>
          <TokenValueInput label="Sell" name="taker" onChange={changeTakerAmount} presets={presets} />
          <TokenValueInput label="Buy" name="maker" onChange={changeMakerAmount} />

          {description && (
            <NotificationBar kind="neutral">
              <NotificationContent>{description}</NotificationContent>
            </NotificationBar>
          )}

          <Button type="button" length="stretch" disabled={!ready} onClick={submit}>
            Buy <TokenValueDisplay value={maker.integer} symbol={maker.token.symbol} />
          </Button>
        </>
      )}

      {!order && (
        <NotificationBar kind="neutral">
          <NotificationContent>Please choose an offer from the order book.</NotificationContent>
        </NotificationBar>
      )}

      <TransactionModal transaction={transaction}>
        {transaction.state.name === 'Take order on OasisDEX' && (
          <TransactionDescription title="Take order on OasisDEX">{description}</TransactionDescription>
        )}
        {transaction.state.name === 'Take order on 0x' && (
          <TransactionDescription title="Take order on 0x">{description}</TransactionDescription>
        )}
      </TransactionModal>
    </Form>
  );
};
