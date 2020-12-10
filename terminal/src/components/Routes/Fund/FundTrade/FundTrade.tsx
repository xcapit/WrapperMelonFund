import React from 'react';
import { ExchangeIdentifier } from '@melonproject/melonjs';
import { Grid, GridRow, GridCol } from '~/storybook/Grid/Grid';
import { FundHoldings } from '~/components/Routes/Fund/FundTrade/FundHoldings/FundHoldings';
import { FundRequestForQuoteTrading } from './FundRequestForQuoteTrading/FundRequestForQuoteTrading';
import { FundLiquidityProviderTrading } from '~/components/Routes/Fund/FundTrade/FundLiquidityProviderTrading/FundLiquidityProviderTrading';
import { FundOrderbookTrading } from '~/components/Routes/Fund/FundTrade/FundOrderbookTrading/FundOrderbookTrading';
import { useFundHoldingsQuery } from './FundHoldings/FundHoldings.query';
import { useFundTrading } from './FundTrade.query';
import { FundTradeHistory } from '../FundDiligence/FundTradeHistory/FundTradeHistory';
import { useEnvironment } from '~/hooks/useEnvironment';
import { NetworkEnum } from '~/types';
import { RequiresFundManager } from '~/components/Gates/RequiresFundManager/RequiresFundManager';
import { RequiresFundDeployedWithCurrentVersion } from '~/components/Gates/RequiresFundDeployedWithCurrentVersion/RequiresFundDeployedWithCurrentVersion';
import { RequiresFundNotShutDown } from '~/components/Gates/RequiresFundNotShutDown/RequiresFundNotShutDown';
import { Block } from '~/storybook/Block/Block';
import { SectionTitle } from '~/storybook/Title/Title';

export interface FundTradeProps {
  address: string;
}

export const FundTrade: React.FC<FundTradeProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const [exchanges, denominationAsset, trading, policies, exchangesQuery] = useFundTrading(address);
  const [holdings, holdingsQuery] = useFundHoldingsQuery(address);
  const loading = exchangesQuery.loading || holdingsQuery.loading;

  const markets = exchanges.filter((exchange) => {
    const supported = [ExchangeIdentifier.OasisDex, ExchangeIdentifier.ZeroExV3];
    return supported.includes(exchange.id as ExchangeIdentifier);
  });

  const providers = exchanges.filter((exchange) => {
    const supported = [ExchangeIdentifier.KyberNetwork, ExchangeIdentifier.Uniswap, ExchangeIdentifier.MelonEngine];
    // Old Uniswap adapter.
    const legacy = ['0x3fda51d218919b96a850e7b66d412a4604e4901d'];
    return [...supported, ...legacy].includes(exchange.id as ExchangeIdentifier);
  });

  const rfq =
    environment.network === NetworkEnum.MAINNET &&
    exchanges.find((exchange) => exchange.id === ExchangeIdentifier.ZeroExV2);

  return (
    <Grid>
      {!loading && (!!providers.length || !!markets.length) && (
        <RequiresFundManager fallback={false}>
          <RequiresFundDeployedWithCurrentVersion address={address} fallback={false}>
            <RequiresFundNotShutDown fallback={false}>
              <GridRow>
                <GridCol>
                  <FundHoldings address={address} />
                </GridCol>
              </GridRow>
              {!!providers.length && !!trading && (
                <GridRow>
                  <GridCol>
                    <FundLiquidityProviderTrading
                      trading={trading}
                      denominationAsset={denominationAsset}
                      exchanges={providers}
                      policies={policies}
                      holdings={holdings}
                    />
                  </GridCol>
                </GridRow>
              )}
              {!!rfq && !!trading && (
                <GridRow>
                  <GridCol>
                    <FundRequestForQuoteTrading
                      trading={trading}
                      denominationAsset={denominationAsset}
                      exchange={rfq}
                      policies={policies}
                      holdings={holdings}
                    />
                  </GridCol>
                </GridRow>
              )}
              {!!markets.length && !!trading && (
                <GridRow>
                  <GridCol>
                    <FundOrderbookTrading
                      trading={trading}
                      denominationAsset={denominationAsset}
                      exchanges={markets}
                      policies={policies}
                      holdings={holdings}
                    />
                  </GridCol>
                </GridRow>
              )}
            </RequiresFundNotShutDown>
          </RequiresFundDeployedWithCurrentVersion>
        </RequiresFundManager>
      )}
    </Grid>
  );
};

export default FundTrade;
