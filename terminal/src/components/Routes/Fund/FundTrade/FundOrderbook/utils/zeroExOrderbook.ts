import { useMemo, useEffect } from 'react';
import * as Rx from 'rxjs';
import { equals } from 'ramda';
import { Orderbook as OrderbookProvider } from '@0x/orderbook';
import { APIOrder as ZeroExOrder } from '@0x/types';
import { assetDataUtils } from '@0x/order-utils';
import { DeployedEnvironment, ExchangeIdentifier, TokenDefinition } from '@melonproject/melonjs';
import { catchError, concatMap, distinctUntilChanged, expand, map } from 'rxjs/operators';
import { NetworkEnum } from '~/types';
import { Orderbook, OrderbookItem } from './aggregatedOrderbook';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';

export interface ZeroExOrderbookItem extends OrderbookItem {
  type: ExchangeIdentifier.ZeroExV3;
  order: ZeroExOrder;
}

const endpoints = {
  [NetworkEnum.MAINNET]: {
    http: 'https://api.0x.org/sra',
    ws: 'wss://api.0x.org/sra/v3',
  },
  [NetworkEnum.KOVAN]: {
    http: 'https://kovan.api.0x.org/sra',
    ws: 'wss://kovan.api.0x.org/sra/v3',
  },
} as {
  [key: number]: {
    http: string;
    ws: string;
  };
};

function mapOrders(
  orders: ZeroExOrder[],
  makerAsset: TokenDefinition,
  takerAsset: TokenDefinition,
  side: 'bid' | 'ask'
) {
  return orders.map((order) => {
    const buyQuantity =
      side === 'bid'
        ? fromTokenBaseUnit(order.order.takerAssetAmount, takerAsset.decimals)
        : fromTokenBaseUnit(order.order.makerAssetAmount, makerAsset.decimals);

    const sellQuantity =
      side === 'bid'
        ? fromTokenBaseUnit(order.order.makerAssetAmount, makerAsset.decimals)
        : fromTokenBaseUnit(order.order.takerAssetAmount, takerAsset.decimals);

    const price = sellQuantity.dividedBy(buyQuantity);

    const result = {
      order,
      price,
      side,
      quantity: buyQuantity,
      exchange: ExchangeIdentifier.ZeroExV3,
      id: `zeroexv3:${order.order.salt}:${order.order.signature}`,
    } as OrderbookItem;

    return result;
  });
}

export function zeroExOrderbook(
  active: boolean,
  environment: DeployedEnvironment,
  makerAsset: TokenDefinition,
  takerAsset?: TokenDefinition
) {
  const provider = useMemo(() => {
    const network = environment.network as NetworkEnum;
    const endpoint = endpoints[network];
    if (!endpoint) {
      return undefined;
    }

    return OrderbookProvider.getOrderbookForWebsocketProvider({
      httpEndpoint: endpoint.http,
      websocketEndpoint: endpoint.ws,
    });
  }, [active, environment]);

  useEffect(() => {
    return () => {
      provider && provider.destroyAsync();
    };
  }, [provider]);

  return useMemo(() => {
    if (!(provider && takerAsset && makerAsset)) {
      return Rx.EMPTY;
    }

    const makerAssetData = assetDataUtils.encodeERC20AssetData(makerAsset.address);
    const takerAssetData = assetDataUtils.encodeERC20AssetData(takerAsset.address);

    const bids$ = Rx.defer(() => provider.getOrdersAsync(makerAssetData, takerAssetData)).pipe(
      catchError(() => Rx.of([]))
    );

    const asks$ = Rx.defer(() => provider.getOrdersAsync(takerAssetData, makerAssetData)).pipe(
      catchError(() => Rx.of([]))
    );

    const delay$ = Rx.timer(1000);
    const orders$ = Rx.combineLatest([bids$, asks$]);
    const polling$ = orders$.pipe(
      expand(() => delay$.pipe(concatMap(() => orders$))),
      distinctUntilChanged((a, b) => equals(a, b))
    );

    return polling$.pipe<Orderbook>(
      map(([b, a]) => ({
        bids: mapOrders(b as any, makerAsset, takerAsset, 'bid'),
        asks: mapOrders(a as any, takerAsset, makerAsset, 'ask'),
      }))
    );
  }, [provider, takerAsset, makerAsset]);
}
