import { AssetBlacklist, AssetWhitelist, Holding, MaxPositions, Policy, Token } from '@melonproject/melongql';
import {
  DeployedEnvironment,
  ExchangeDefinition,
  ExchangeIdentifier,
  sameAddress,
  TokenDefinition,
} from '@melonproject/melonjs';
import BigNumber from 'bignumber.js';
import React, { useLayoutEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { Form, useFormik, Wrapper } from '~/components/Form/Form';
import { TokenSwap } from '~/components/Form/TokenSwap/TokenSwap';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Block } from '~/storybook/Block/Block';
import { Grid, GridCol, GridRow } from '~/storybook/Grid/Grid';
import { Link } from '~/storybook/Link/Link';
import { NotificationBar, NotificationContent } from '~/storybook/NotificationBar/NotificationBar';
import { SectionTitle } from '~/storybook/Title/Title';
import { TokenValue } from '~/TokenValue';
import { tokenValueSchema } from '~/utils/formValidation';
import { FundKyberTrading } from '../FundKyberTrading/FundKyberTrading';
import { FundMelonEngineTrading } from '../FundMelonEngineTrading/FundMelonEngineTrading';
import { FundUniswapTrading } from '../FundUniswapTrading/FundUniswapTrading';

export interface FundLiquidityProviderTradingProps {
  trading: string;
  denominationAsset?: Token;
  exchanges: ExchangeDefinition[];
  holdings: Holding[];
  policies?: Policy[];
}

export const FundLiquidityProviderTrading: React.FC<FundLiquidityProviderTradingProps> = (props) => {
  const environment = useEnvironment()!;

  const assetWhitelists = props.policies?.filter((policy) => policy.identifier === 'AssetWhitelist') as
    | AssetWhitelist[]
    | undefined;
  const assetBlacklists = props.policies?.filter((policy) => policy.identifier === 'AssetBlacklist') as
    | AssetBlacklist[]
    | undefined;
  const maxPositionsPolicies = props.policies?.filter((policy) => policy.identifier === 'MaxPositions') as
    | MaxPositions[]
    | undefined;

  const nonZeroHoldings = props.holdings.filter((holding) => !holding.amount?.isZero());

  const takerOptions = environment.tokens.filter((item) => !item.historic).map((token) => token);

  const makerOptions = environment.tokens
    .filter((item) => !item.historic)
    .filter(
      (asset) =>
        sameAddress(asset.address, props.denominationAsset?.address) ||
        !assetWhitelists?.length ||
        assetWhitelists.every((list) => list.assetWhitelist?.some((item) => sameAddress(item, asset.address)))
    )
    .filter(
      (asset) =>
        sameAddress(asset.address, props.denominationAsset?.address) ||
        !assetBlacklists?.length ||
        !assetBlacklists.some((list) => list.assetBlacklist?.some((item) => sameAddress(item, asset.address)))
    );

  if (takerOptions?.length < 2) {
    return (
      <Block>
        <SectionTitle>Liquidity Pool Trading</SectionTitle>
        <p>
          Liquidity pool trading is not possible because the fund's risk management policies prevent the investment in
          any asset.
        </p>
      </Block>
    );
  }

  const uniswapLegacyWarning =
    props.exchanges.includes(environment.getExchange('0x3fda51d218919b96a850e7b66d412a4604e4901d')) &&
    !props.exchanges.includes(environment.getExchange(ExchangeIdentifier.Uniswap));

  return (
    <Block>
      <SectionTitle>Liquidity Pool Trading</SectionTitle>

      {uniswapLegacyWarning && (
        <NotificationBar kind="error">
          <NotificationContent>
            We have deployed a bug fix for the Uniswap adapter. To continue trading on Uniswap, you have to{' '}
            <Link to={`manage`}>register</Link> the new adapter in the <Link to={`manage`}>admin section</Link> of your
            fund.
          </NotificationContent>
        </NotificationBar>
      )}

      <FundLiquidityProviderTradingForm
        takerOptions={takerOptions}
        makerOptions={makerOptions}
        environment={environment}
        maxPositionsPolicies={maxPositionsPolicies}
        nonZeroHoldings={nonZeroHoldings}
        {...props}
      />
    </Block>
  );
};

const validationSchema = Yup.object().shape({
  maker: Yup.mixed<TokenDefinition>(),
  taker: tokenValueSchema()
    .required()
    .lte(Yup.ref('takerBalance'), 'The balance of your fund is too low for this trade.'),
  takerBalance: tokenValueSchema().required(),
});

interface FundLiquidityProviderTradingFormProps extends FundLiquidityProviderTradingProps {
  takerOptions: TokenDefinition[];
  makerOptions: TokenDefinition[];
  environment: DeployedEnvironment;
  maxPositionsPolicies: MaxPositions[] | undefined;
  nonZeroHoldings: Holding[];
}

const FundLiquidityProviderTradingForm: React.FC<FundLiquidityProviderTradingFormProps> = ({
  takerOptions,
  makerOptions,
  environment,
  maxPositionsPolicies,
  denominationAsset,
  nonZeroHoldings,
  holdings,
  ...props
}) => {
  const validationContext = React.useMemo(() => ({ maxPositionsPolicies, denominationAsset, nonZeroHoldings }), [
    maxPositionsPolicies,
    denominationAsset,
    nonZeroHoldings,
  ]);

  const initialValues = {
    taker: new TokenValue(takerOptions[0], 1),
    maker: makerOptions[1],
    takerBalance: new TokenValue(takerOptions[0]),
  };

  const formik = useFormik({
    validationSchema,
    validationContext,
    initialValues,
    onSubmit: () => {},
  });

  const taker = formik.values.taker;
  const maker = formik.values.maker;

  const takerBalance = useMemo(() => {
    const index = nonZeroHoldings.findIndex((holding) => sameAddress(holding.token?.address, taker.token.address));
    const balance = index !== -1 ? (nonZeroHoldings[index].amount as BigNumber) : 0;
    return TokenValue.fromToken(taker.token, balance);
  }, [taker, nonZeroHoldings]);

  useLayoutEffect(() => {
    formik.setFieldValue('takerBalance', takerBalance);
  }, [takerBalance]);

  const mln = environment.getToken('MLN');
  const weth = environment.getToken('WETH');
  const exchanges = props.exchanges
    .map((exchange) => {
      if (exchange.id === ExchangeIdentifier.KyberNetwork) {
        return [exchange, FundKyberTrading];
      }

      if (exchange.id === ExchangeIdentifier.Uniswap) {
        return [exchange, FundUniswapTrading];
      }

      if (exchange.id === ExchangeIdentifier.MelonEngine) {
        if (maker === weth && taker.token === mln) {
          return [exchange, FundMelonEngineTrading];
        }

        return null;
      }

      return null;
    })
    .filter((value) => !!value) as [ExchangeDefinition, React.ElementType][];

  const presets = React.useMemo(
    () => [
      {
        label: 'Max',
        value: takerBalance,
      },
    ],
    [takerBalance]
  );

  return (
    <Form formik={formik}>
      <Grid>
        <GridRow>
          <GridCol md={6} xs={12}>
            <SectionTitle>Choose the assets to swap</SectionTitle>
            <TokenSwap
              label="Sell"
              baseName="taker"
              baseTokens={takerOptions}
              quoteName="maker"
              quoteTokens={makerOptions}
              presets={presets}
            ></TokenSwap>
          </GridCol>

          <GridCol md={6} xs={12}>
            <SectionTitle>Choose your pool and swap</SectionTitle>
            <Grid noGap={true}>
              <GridRow>
                {!!(exchanges && exchanges.length) &&
                  exchanges.map(([exchange, Component]) => (
                    <GridCol key={exchange.id}>
                      <Wrapper>
                        <Component
                          active={formik.isValid}
                          trading={props.trading}
                          holdings={holdings}
                          denominationAsset={denominationAsset}
                          policies={props.policies}
                          exchange={exchange}
                          maker={maker}
                          taker={taker.token}
                          quantity={taker.value}
                        />
                      </Wrapper>
                    </GridCol>
                  ))}
              </GridRow>
            </Grid>
          </GridCol>
        </GridRow>
      </Grid>
    </Form>
  );
};
