import * as Rx from 'rxjs';
import BigNumber from 'bignumber.js';
import { startWith } from 'rxjs/operators';
import { DeployedEnvironment, ExchangeDefinition, ExchangeIdentifier, TokenDefinition } from '@melonproject/melonjs';
import { zeroExOrderbook } from './zeroExOrderbook';
import { matchingMarketOrderbook } from './matchingMarketOrderbook';
import { useMemo } from 'react';

export interface OrderbookItem {
  id: string;
  order: any;
  price: BigNumber;
  quantity: BigNumber;
  side: 'bid' | 'ask';
  exchange: ExchangeIdentifier;
  total?: BigNumber;
  relative?: number;
  change?: number;
}

export interface Orderbook {
  asks: OrderbookItem[];
  bids: OrderbookItem[];
  decimals?: number;
}
/**
 * Returns the index of the digit at which one price differs from another or undefined if the prices are the same.
 * Requires that the potentially shorter length is passed first.
 *
 * @param base the potentially shorter string to compare
 * @param comparison the potentially longer string to compare
 */
export function findPriceChange(base: BigNumber, comparison?: BigNumber) {
  if (!comparison) {
    return 0;
  }

  const baseString = base.toFixed(8);
  const compString = comparison.toFixed(8);
  const offset = baseString.length - compString.length;

  for (let i = 0; i < baseString.length; i += 1) {
    const current = baseString[i + offset];

    if (!current) {
      return 0;
    }

    if (current !== compString[i]) {
      return i + offset;
    }
  }

  return undefined;
}

/**
 * Returns the index at which the smallest price change occurs in two arrays of [[OrderbookItem]]s.
 * Used to control how many decimals to show in an order book render function.
 *
 * @param bids an array of [[OrderbookItem]]
 * @param asks an array of [[OrderbookItem]]
 */
export function findPriceDecimals(bids: OrderbookItem[], asks: OrderbookItem[]) {
  const bidsDecimal = bids.reduce(
    (carry, current) => (current.change && current.change > carry ? current.change : carry),
    0
  );

  const askDecimal = asks.reduce(
    (carry, current) => (current.change && current.change > carry ? current.change : carry),
    0
  );

  return askDecimal > bidsDecimal ? askDecimal : bidsDecimal;
}

export function aggregatedOrderbook(
  environment: DeployedEnvironment,
  exchanges: ExchangeDefinition[],
  makerAsset: TokenDefinition,
  takerAsset?: TokenDefinition
) {
  const ids = exchanges.map((item) => item.id);

  const zeroExActive = ids.includes(ExchangeIdentifier.ZeroExV3);
  const zeroEx = zeroExOrderbook(zeroExActive, environment, makerAsset, takerAsset);

  const matchingMarketActive = ids.includes(ExchangeIdentifier.OasisDex);
  const matchingMarket = matchingMarketOrderbook(matchingMarketActive, environment, makerAsset, takerAsset);

  return useMemo(() => {
    const empty = {
      asks: [],
      bids: [],
    } as Orderbook;

    const streams = [zeroEx.pipe(startWith(empty)), matchingMarket.pipe(startWith(empty))];

    return Rx.combineLatest(streams, (...groups) => {
      const empty = [] as OrderbookItem[];

      const asksOnly = groups.map((item) => item.asks);
      const asksFlat = empty.concat
        .apply(empty, asksOnly)
        .sort((a, b) => a.price.comparedTo(b.price))
        .slice(0, 10) as OrderbookItem[];

      const asksQuantity = asksFlat.reduce((carry, current) => carry.plus(current.quantity), new BigNumber(0));
      const asks = asksFlat
        .reduce((carry, current, index) => {
          const previous = carry[index - 1]?.total ?? new BigNumber(0);
          const total = current.quantity.plus(previous);
          const relative = total.dividedBy(asksQuantity).multipliedBy(100).decimalPlaces(0).toNumber();

          const change = findPriceChange(current.price, carry[index - 1]?.price);

          const item: OrderbookItem = {
            ...current,
            change,
            total,
            relative,
          };

          return [...carry, item];
        }, [] as OrderbookItem[])
        .reverse();

      const bidsOnly = groups.map((item) => item.bids);
      const bidsFlat = empty.concat
        .apply(empty, bidsOnly)
        .sort((a, b) => b.price.comparedTo(a.price))
        .slice(0, 10) as OrderbookItem[];

      const bidsQuantity = bidsFlat.reduce((carry, current) => carry.plus(current.quantity), new BigNumber(0));
      const bids = bidsFlat.reduce((carry, current, index) => {
        const previous = carry[index - 1]?.total ?? new BigNumber(0);
        const total = current.quantity.plus(previous);
        const relative = total.dividedBy(bidsQuantity).multipliedBy(100).decimalPlaces(0).toNumber();

        const change = findPriceChange(current.price, carry[index - 1]?.price);

        const item: OrderbookItem = {
          ...current,
          change,
          total,
          relative,
        };

        return [...carry, item];
      }, [] as OrderbookItem[]);

      const decimals = findPriceDecimals(asks, bids);

      return { asks, bids, decimals } as Orderbook;
    });
  }, [zeroEx, matchingMarket]);
}
