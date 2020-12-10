import { AssetBlacklist, AssetWhitelist, Holding, MaxPositions, Policy, Token } from '@melonproject/melongql';
import { ExchangeDefinition, sameAddress, TokenDefinition } from '@melonproject/melonjs';
import { BigNumber } from 'bignumber.js';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { Form, useFormik, Wrapper } from '~/components/Form/Form';
import { TokenSwap } from '~/components/Form/TokenSwap/TokenSwap';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Block } from '~/storybook/Block/Block';
import { Grid, GridCol, GridRow } from '~/storybook/Grid/Grid';
import { SectionTitle } from '~/storybook/Title/Title';
import { TokenValue } from '~/TokenValue';
import { tokenValueSchema } from '~/utils/formValidation';
import { FundRequestForQuoteOffer } from './FundRequestForQuoteOffer';

export interface FundRequestForQuoteTradingProps {
  trading: string;
  denominationAsset?: Token;
  exchange: ExchangeDefinition;
  holdings: Holding[];
  policies?: Policy[];
}

interface Asset {
  address: string;
  decimals: string;
  type: string;
}

interface Market {
  id: string;
  base: Asset;
  quote: Asset;
  status: string;
}

function useMarkets() {
  const environment = useEnvironment()!;
  const [state, setState] = useState({
    loading: true,
    markets: [] as Market[],
  });

  useEffect(() => {
    (async () => {
      try {
        const result = await (await fetch(`${process.env.MELON_API_GATEWAY}/rfq/markets`)).json();

        setState({
          loading: false,
          markets: result?.items ?? [],
        });
      } catch (e) {
        setState({
          loading: false,
          markets: [],
        });
      }
    })();
  }, []);

  const markets = useMemo(() => {
    return state.markets
      .filter((item) => item.status === 'available')
      .reduce((carry, current) => {
        const baseToken = environment.getToken(current.base.address);
        const quoteToken = environment.getToken(current.quote.address);
        if (!baseToken || !quoteToken || baseToken.historic || quoteToken.historic) {
          return carry;
        }

        const baseEntries = carry.get(baseToken) ?? new Map();
        baseEntries.set(quoteToken, [current.id, 'buy']);

        const quoteEntries = carry.get(quoteToken) ?? new Map();
        quoteEntries.set(baseToken, [current.id, 'sell']);

        return carry.set(baseToken, baseEntries).set(quoteToken, quoteEntries);
      }, new Map<TokenDefinition, Map<TokenDefinition, [string, 'sell' | 'buy']>>());
  }, [environment.tokens, state.markets]);

  return [markets, state.loading] as [typeof markets, typeof state.loading];
}

const validationSchema = Yup.object().shape({
  taker: tokenValueSchema()
    .required()
    .lte(Yup.ref('takerBalance'), 'The balance of your fund is too low for this trade.'),
  maker: Yup.mixed<TokenDefinition>(),
  takerBalance: tokenValueSchema().required(),
});

export const FundRequestForQuoteTrading: React.FC<FundRequestForQuoteTradingProps> = (props) => {
  const [markets, loading] = useMarkets();
  const environment = useEnvironment()!;

  const nonZeroHoldings = React.useMemo(() => props.holdings.filter((holding) => !holding.amount?.isZero()), [
    props.holdings,
  ]);

  const initialValues = {
    taker: new TokenValue(environment.getToken('WETH'), 1),
    maker: environment.getToken('USDC'),
    takerBalance: new TokenValue(environment.getToken('WETH')),
  };

  const formik = useFormik({
    validationSchema,
    initialValues,
    onSubmit: () => {},
  });

  useEffect(() => {
    formik.validateForm().catch(() => {});
  }, [props.holdings, formik.touched]);

  const taker = formik.values.taker;
  const maker = formik.values.maker;

  const takerCandidates = useMemo(() => Array.from(markets.keys()), [markets]);
  const makerCandidates = useMemo(() => {
    if (!taker) {
      return [] as TokenDefinition[];
    }

    const makers = markets.has(taker.token) ? Array.from(markets.get(taker.token)!.keys()) : ([] as TokenDefinition[]);
    return makers.concat([taker.token]);
  }, [markets, taker]);

  useEffect(() => {
    if (!taker || !takerCandidates.includes(taker.token)) {
      if (takerCandidates[0]) {
        formik.setFieldValue('taker', new TokenValue(takerCandidates[0]));
      }
    }

    formik.validateForm().catch(() => {});
  }, [takerCandidates, taker]);

  useEffect(() => {
    if (!maker || !makerCandidates.includes(maker)) {
      if (makerCandidates[1]) {
        formik.setFieldValue('maker', makerCandidates[1]);
      }
    }

    formik.validateForm().catch(() => {});
  }, [makerCandidates, maker]);

  const handleTokenSwapChange = (
    after: { base?: TokenValue; quote?: TokenDefinition },
    before: { base?: TokenValue; quote?: TokenDefinition }
  ) => {
    const candidates =
      after.base?.token && markets.has(after.base?.token)
        ? Array.from(markets.get(after.base?.token)!.keys())
        : ([] as TokenDefinition[]);
    if (!maker || !candidates.includes(maker)) {
      formik.setFieldValue('maker', candidates[0], true);
    }
  };

  const takerBalance = useMemo(() => {
    const index = nonZeroHoldings.findIndex((holding) => sameAddress(holding.token?.address, taker.token.address));
    const balance = index !== -1 ? (nonZeroHoldings[index].amount as BigNumber) : 0;
    return TokenValue.fromToken(taker.token, balance);
  }, [taker, nonZeroHoldings]);

  useLayoutEffect(() => {
    formik.setFieldValue('takerBalance', takerBalance);
  }, [takerBalance]);

  const [market, side] = markets.get(taker?.token)?.get(maker) ?? [];
  const amount = formik.values.taker?.value;
  const ready = !!(formik.isValid && market && amount && !amount.isNaN());

  const presets = React.useMemo(() => {
    if (loading) {
      return [];
    }

    return [
      {
        label: 'Max',
        value: takerBalance,
      },
    ];
  }, [loading, takerBalance]);

  if (!takerCandidates.length) {
    return (
      <Block>
        <SectionTitle>Request a Quote on 0x</SectionTitle>
        <p>Request a quote on 0x trading is currently not possible. Please check back later.</p>
      </Block>
    );
  }

  return (
    <Block>
      <SectionTitle>Request a Quote on 0x</SectionTitle>

      <Form formik={formik}>
        <Grid>
          <GridRow>
            <GridCol md={6}>
              <SectionTitle>Choose the assets to swap</SectionTitle>

              <TokenSwap
                label="Sell"
                baseName="taker"
                baseTokens={takerCandidates}
                quoteName="maker"
                quoteTokens={makerCandidates}
                onChange={handleTokenSwapChange}
                disabled={loading}
                presets={presets}
              ></TokenSwap>
            </GridCol>

            <GridCol md={6}>
              <SectionTitle>Review quote</SectionTitle>
              <Wrapper>
                <FundRequestForQuoteOffer
                  active={ready}
                  exchange={props.exchange}
                  trading={props.trading}
                  market={market}
                  side={side}
                  symbol={maker.symbol}
                  amount={amount}
                  holdings={props.holdings}
                  denominationAsset={props.denominationAsset}
                  policies={props.policies}
                />
              </Wrapper>
            </GridCol>
          </GridRow>
        </Grid>
      </Form>
    </Block>
  );
};
