import React, { useState, useEffect } from 'react';
import { ExchangeDefinition, sameAddress } from '@melonproject/melonjs';
import { Holding, Policy, Token } from '@melonproject/melongql';
import { FundOrderbook } from '../FundOrderbook/FundOrderbook';
import { OrderbookItem } from '../FundOrderbook/utils/aggregatedOrderbook';
import { useEnvironment } from '~/hooks/useEnvironment';
import { FundOrderbookMarketForm } from '../FundOrderbookMarketForm/FundOrderbookMarketForm';
import { Block } from '~/storybook/Block/Block';
import { SectionTitle } from '~/storybook/Title/Title';
import * as S from './FundOrderbookTrading.styles';
import { SelectWidget } from '~/components/Form/Select/Select';

export interface FundOrderbookTradingProps {
  trading: string;
  denominationAsset?: Token;
  exchanges: ExchangeDefinition[];
  holdings: Holding[];
  policies?: Policy[];
}

export const FundOrderbookTrading: React.FC<FundOrderbookTradingProps> = (props) => {
  const environment = useEnvironment()!;

  const weth = environment.getToken('WETH');

  const [asset, setAsset] = useState(environment.getToken('DAI'));
  const [order, setOrder] = useState<OrderbookItem>();

  useEffect(() => {
    setOrder(undefined);
  }, [asset]);

  const assetPairOptions = React.useMemo(() => {
    return environment.tokens
      .filter((token) => token !== weth && !token.historic)
      .map((token) => ({
        value: token.address,
        label: `${token.symbol} / ${weth.symbol}`,
      }));
  }, [environment.tokens, weth]);

  const selectedAssetPair = React.useMemo(() => {
    return assetPairOptions.find((item) => sameAddress(item.value, asset.address));
  }, [assetPairOptions, asset.address]);

  return (
    <Block>
      <SectionTitle>Order Book Trading</SectionTitle>

      <S.FundOrderbookTrading>
        <S.FundOrderbookForm>
          <SelectWidget
            name="asset"
            label="Asset pair"
            options={assetPairOptions}
            value={selectedAssetPair}
            onChange={(value) => value && setAsset(environment.getToken((value as any).value)!)}
          />

          {asset && (
            <FundOrderbookMarketForm
              trading={props.trading}
              denominationAsset={props.denominationAsset}
              asset={asset}
              order={order}
              unsetOrder={() => setOrder(undefined)}
              holdings={props.holdings}
              policies={props.policies}
              exchanges={props.exchanges}
            />
          )}
        </S.FundOrderbookForm>

        {asset && (
          <S.FundOrderbook>
            <FundOrderbook
              asset={asset}
              exchanges={props.exchanges}
              selected={order}
              setSelected={(order?: OrderbookItem) => {
                setOrder(order);
              }}
            />
            <S.FundOrderbookFooter>
              The order book is the aggregation of the OasisDEX and/or 0x Relayers order books (depending on the
              configured exchanges).
            </S.FundOrderbookFooter>
          </S.FundOrderbook>
        )}
      </S.FundOrderbookTrading>
    </Block>
  );
};
