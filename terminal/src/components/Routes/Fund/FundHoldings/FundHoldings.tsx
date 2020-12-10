import React from 'react';
import { Spinner } from '~/storybook/Spinner/Spinner';

import * as S from './FundHoldings.styles';
import BigNumber from 'bignumber.js';
import {
  ScrollableTable,
  Table,
  HeaderCell,
  HeaderCellRightAlign,
  BodyCell,
  BodyCellRightAlign,
  BodyRow,
  HeaderRow,
} from '~/storybook/Table/Table';
import { SectionTitle } from '~/storybook/Title/Title';
import { Block } from '~/storybook/Block/Block';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { Icons, IconName } from '~/storybook/Icons/Icons';
import { TokenValueDisplay } from '~/components/Common/TokenValueDisplay/TokenValueDisplay';
import { useCurrency } from '~/hooks/useCurrency';
import { useFetchFundPricesByDepth } from '~/hooks/metricsService/useFetchFundPricesByDepth';
import { calculateReturn } from '~/utils/finance';
import { useEnvironment } from '~/hooks/useEnvironment';
import { getRate } from '~/components/Contexts/Currency/Currency';

export interface FundHoldingsProps {
  address: string;
}

const coloredIcons = ['MLN', 'REN', 'ZRX'];

export const FundHoldings: React.FC<FundHoldingsProps> = ({ address }) => {
  const currency = useCurrency();
  const environment = useEnvironment()!;

  const { data: dailyData, isError: dailyDataError, isFetching: dailyDataFetching } = useFetchFundPricesByDepth(
    address,
    '1w'
  );

  if (dailyDataFetching) {
    return (
      <Block>
        <SectionTitle>Portfolio Holdings</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  const current = dailyData?.data[dailyData?.data.length - 1];
  const previous = dailyData?.data[dailyData?.data.length - 2];

  if (dailyDataError) {
    return (
      <Block>
        <SectionTitle>Portfolio Holdings</SectionTitle>
        <ScrollableTable maxHeight="650px">There was an error fetching the portfolio holdings.</ScrollableTable>
      </Block>
    );
  }

  const currentHoldings = Object.keys(current?.holdings || [])
    .map((key) => {
      const currentPrice = new BigNumber(current?.rates?.[key] ?? 'NaN').dividedBy(
        current?.rates ? getRate(current.rates, currency.currency) : 'NaN'
      );
      const previousPrice = new BigNumber(previous?.rates?.[key] ?? 'NaN').dividedBy(
        previous?.rates ? getRate(previous.rates, currency.currency) : 'NaN'
      );

      return {
        symbol: key,
        name: environment.getToken(key).name,
        amount: new BigNumber(current.holdings[key]),
        price: currentPrice,
        value: new BigNumber(current.holdings[key]).multipliedBy(currentPrice),
        change: calculateReturn(currentPrice, previousPrice),
      };
    })
    .filter((holding) => !holding.amount.isZero())
    .sort((a, b) => b.value.comparedTo(a.value));

  const totalValue = currentHoldings.reduce((acc, current) => {
    return acc.plus(current.value || new BigNumber(0));
  }, new BigNumber(0));

  if (!currentHoldings.length) {
    return (
      <Block>
        <SectionTitle>Portfolio Holdings</SectionTitle>
        <ScrollableTable maxHeight="650px">No current holdings.</ScrollableTable>
      </Block>
    );
  }

  return (
    <Block>
      <SectionTitle>Portfolio Holdings</SectionTitle>
      <ScrollableTable>
        <Table>
          <thead>
            <HeaderRow>
              <HeaderCell>Asset</HeaderCell>
              <HeaderCellRightAlign>Balance</HeaderCellRightAlign>
              <HeaderCellRightAlign>Price [{currency.currency}]</HeaderCellRightAlign>
              <HeaderCellRightAlign>Daily change</HeaderCellRightAlign>
              <HeaderCellRightAlign>Value [{currency.currency}]</HeaderCellRightAlign>
              <HeaderCellRightAlign>Allocation</HeaderCellRightAlign>
            </HeaderRow>
          </thead>
          <tbody>
            {currentHoldings.map((holding, key) => (
              <BodyRow key={key}>
                <BodyCell>
                  <S.HoldingIcon>
                    <Icons
                      name={holding.symbol as IconName}
                      size="small"
                      colored={coloredIcons.some((icon) => icon === holding.symbol)}
                    />
                  </S.HoldingIcon>
                  <S.HoldingName>
                    <S.HoldingSymbol>{holding.symbol}</S.HoldingSymbol>
                    <br />
                    <S.HoldingName>{holding.name}</S.HoldingName>
                  </S.HoldingName>
                </BodyCell>
                <BodyCellRightAlign>
                  <TokenValueDisplay value={holding.amount!} decimals={0} />
                </BodyCellRightAlign>
                <BodyCellRightAlign>
                  <TokenValueDisplay value={holding.price} decimals={0} />
                </BodyCellRightAlign>
                <BodyCellRightAlign>
                  {holding.symbol && (
                    <>
                      <FormattedNumber value={holding.change} colorize={true} decimals={2} suffix="%" />
                    </>
                  )}
                </BodyCellRightAlign>

                <BodyCellRightAlign>
                  <TokenValueDisplay value={holding.value} decimals={0} />
                </BodyCellRightAlign>
                <BodyCellRightAlign>
                  <FormattedNumber value={holding.value?.dividedBy(totalValue).times(100)} decimals={2} suffix="%" />
                </BodyCellRightAlign>
              </BodyRow>
            ))}
          </tbody>
        </Table>
      </ScrollableTable>
    </Block>
  );
};
