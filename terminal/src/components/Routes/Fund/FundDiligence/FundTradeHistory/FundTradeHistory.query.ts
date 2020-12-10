import gql from 'graphql-tag';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { useTheGraphQuery } from '~/hooks/useQuery';
import { ExchangeDefinition, TokenDefinition, sameAddress } from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';

export interface Trade {
  id: string;
  timestamp: number;
  exchange?: ExchangeDefinition;
  buyAsset?: TokenDefinition;
  sellAsset?: TokenDefinition;
  buyQuantity?: BigNumber;
  sellQuantity?: BigNumber;
  price?: BigNumber;
  methodName?: string;
}

export interface FundTradeHistoryQueryVariables {
  address?: string;
}

const FundTradeHistoryQuery = gql`
  query FundTradeHistoryQuery($address: ID!) {
    fund(id: $address) {
      trading {
        trades(orderBy: timestamp, orderDirection: "desc") {
          id
          timestamp
          exchange {
            id
          }
          assetSold {
            id
          }
          assetBought {
            id
          }
          amountSold
          amountBought
          methodName
        }
      }
    }
  }
`;

export const useFundTradeHistoryQuery = (address: string) => {
  const environment = useEnvironment()!;
  const result = useTheGraphQuery<any, FundTradeHistoryQueryVariables>(FundTradeHistoryQuery, {
    variables: { address: address?.toLowerCase() },
  });

  const trades = useMemo(
    () =>
      (result.data?.fund?.trading?.trades || []).map((item: any) => {
        const buyAsset = item.assetBought?.id && environment.getToken(item.assetBought?.id);
        const sellAsset = item.assetSold?.id && environment.getToken(item.assetSold?.id);

        const buyAmount = new BigNumber(item.amountBought ?? 0);
        const sellAmount = new BigNumber(item.amountSold ?? 0);

        const buyQuantity = buyAsset && fromTokenBaseUnit(buyAmount, buyAsset.decimals);
        const sellQuantity = sellAsset && fromTokenBaseUnit(sellAmount, sellAsset.decimals);
        const exchange = environment.exchanges.find((exchange) => sameAddress(exchange.exchange, item.exchange?.id));

        const price =
          sellQuantity && !sellQuantity.isZero() && buyQuantity && !buyQuantity?.isZero()
            ? sellQuantity.dividedBy(buyQuantity)
            : new BigNumber('NaN');

        return {
          buyAsset,
          sellAsset,
          buyQuantity,
          sellQuantity,
          price,
          exchange,
          id: item.id,
          timestamp: item.timestamp,
          methodName: item.methodName,
        } as Trade;
      }) as Trade[],
    [result.data]
  );

  return [trades, result] as [typeof trades, typeof result];
};
