import React, { createContext } from 'react';
import BigNumber from 'bignumber.js';
import { TokenValue } from '~/TokenValue';
import { calculateChangeFromSharePrice } from '~/utils/calculateChangeFromSharePrice';
import { useEnvironment } from '~/hooks/useEnvironment';
import { sameAddress } from '@melonproject/melonjs';
import { useCurrency } from '~/hooks/useCurrency';
import { useFetchFundList } from '~/hooks/metricsService/useFetchFundList';
import { getRate } from '~/components/Contexts/Currency/Currency';
import { sortBigNumber } from '~/utils/sortBigNumber';

interface FundState {
  calculations: {
    price: number;
    gav: number;
    nav: number;
  };
  rates: {
    [key: string]: number;
  };
  holdings: {
    [key: string]: number;
  };
}

export interface Fund {
  address: string;
  name: string;
  inception: number;
  active: boolean;

  policies: {
    identifier: string;
  }[];

  version: string;

  current: FundState;
  previousDay: FundState;
  previousMonth: FundState;
  previousYear: FundState;
  first: FundState;
  investments: number;
}

export interface FundListContext {
  list: RowData[];
  loading?: boolean;
}

export type RowData = {
  address: string;
  name: string;
  sharePrice: number;
  aumEth: number;
  aum: number;
  userWhitelist: boolean;
  closed: boolean;
  returnSinceYesterday: BigNumber;
  returnMTD: BigNumber;
  returnSinceInception: BigNumber;
  top5Holdings: [string, BigNumber][];
  top5AUM: boolean;
  topAUM: boolean;
  top5SinceInception: boolean;
  topSinceInception: boolean;
  top5MTD: boolean;
  topMTD: boolean;
  top5Recent: boolean;
  topRecent: boolean;
  top5Investments: boolean;
  topInvestments: boolean;
  age: number;
  largeFund: boolean;
  tinyFund: boolean;
  underperformingFund: boolean;
  holdings: TokenValue[];
};

export const FundList = createContext<FundListContext>({} as FundListContext);

export const FundListProvider: React.FC = (props) => {
  const environment = useEnvironment()!;
  const result = useFetchFundList();

  const currency = useCurrency();
  const version = environment?.deployment.melon.addr.Version;

  const data = React.useMemo(() => {
    if (!environment) {
      return [];
    }

    const funds = (result.data?.data?.funds ?? []) as Fund[];

    const list = funds
      .sort((a, b) => b.current.calculations.gav - a.current.calculations.gav)
      .map((item, index) => {
        const holdings = Object.keys(item.current.holdings).map((asset) => {
          const token = environment.getToken(asset);
          return new TokenValue(token, item.current.holdings[asset] * item.current.rates[asset]);
        });

        const userWhitelist = !!item.policies.find((policy) => policy.identifier === 'USER_WHITELIST');
        const closed = !item.active || !sameAddress(item.version, version);

        const aumEth = item.current.calculations.gav;

        const currentRate = getRate(item.current.rates, currency.currency);
        const previousDayRate = getRate(item.previousDay.rates, currency.currency);
        const previousMonthRate = getRate(item.previousMonth.rates, currency.currency);
        const previousYearRate = getRate(item.previousYear.rates, currency.currency);
        const firstRate = getRate(item.first.rates, currency.currency);

        const aum = aumEth / currentRate;
        const sharePrice = item.current.calculations.price / currentRate;
        const previousDayPrice = item.previousDay.calculations.price / previousDayRate;
        const previousMonthPrice = item.previousMonth.calculations.price / previousMonthRate;
        const previousYearPrice = item.previousYear.calculations.price / previousYearRate;
        const firstPrice = 1 / firstRate;

        const returnSinceYesterday = calculateChangeFromSharePrice(sharePrice, previousDayPrice);
        const returnMTD = calculateChangeFromSharePrice(sharePrice, previousMonthPrice);
        const returnYTD = calculateChangeFromSharePrice(sharePrice, previousYearPrice);
        const returnSinceInception = calculateChangeFromSharePrice(sharePrice, firstPrice);

        const top5AUM = index < 5 ? true : false;
        const topAUM = index === 0 ? true : false;
        const top5SinceInception = false;
        const topSinceInception = false;
        const top5MTD = false;
        const topMTD = false;
        const top5Recent = false;
        const topRecent = false;
        const top5Investments = false;
        const topInvestments = false;

        const age = (Date.now() / 1000 - item.inception) / (24 * 60 * 60);
        const investments = item.investments;

        const largeFund = aumEth > 100;
        const tinyFund = aumEth < 1;
        const underperformingFund = returnSinceInception.isLessThan(-20);

        const top5Holdings: [string, BigNumber][] =
          aumEth === 0
            ? []
            : holdings
                .filter((holding) => !holding?.value?.isZero())
                .sort((a, b) => b.value!.comparedTo(a.value!))
                .slice(0, 5)
                .map((holding) => {
                  const percentage = holding.value!.dividedBy(aumEth).multipliedBy(100);
                  return [holding.token.symbol, percentage];
                });

        return {
          name: item.name,
          address: item.address,
          sharePrice,
          aumEth,
          aum,
          userWhitelist,
          closed,
          returnSinceYesterday,
          returnMTD,
          returnYTD,
          returnSinceInception,
          top5Holdings,
          top5AUM,
          topAUM,
          top5SinceInception,
          topSinceInception,
          top5MTD,
          topMTD,
          top5Recent,
          topRecent,
          top5Investments,
          topInvestments,
          age,
          investments,
          largeFund,
          tinyFund,
          underperformingFund,
          holdings,
        };
      });

    return list;
  }, [result.data, currency.currency, environment]);

  const d1 = React.useMemo(() => {
    return data
      .sort((a, b) => sortBigNumber(a.returnMTD, b.returnMTD))
      .map((fund, index) => {
        return { ...fund, ...(index < 5 && { top5MTD: true }), ...(index === 0 && { topMTD: true }) };
      });
  }, [data]);

  const d2 = React.useMemo(() => {
    return d1
      .sort((a, b) => sortBigNumber(a.returnSinceInception, b.returnSinceInception))
      .map((fund, index) => {
        return {
          ...fund,
          ...(index < 5 && { top5SinceInception: true }),
          ...(index === 0 && { topSinceInception: true }),
        };
      });
  }, [d1]);

  const d3 = React.useMemo(() => {
    return d2
      .sort((a, b) => a.age - b.age)
      .map((fund, index) => {
        return { ...fund, ...(index < 5 && { top5Recent: true }), ...(index === 0 && { topRecent: true }) };
      });
  }, [d2]);

  const d4 = React.useMemo(() => {
    return d3
      .sort((a, b) => b.investments - a.investments)
      .map((fund, index) => {
        return { ...fund, ...(index < 5 && { top5Investments: true }), ...(index === 0 && { topInvestments: true }) };
      });
  }, [d3]);

  const list = React.useMemo(() => d4.sort((a, b) => b.aumEth - a.aumEth), [d4]);

  const context: FundListContext = {
    list,
    loading: result.isLoading,
  };

  return <FundList.Provider value={context}>{props.children}</FundList.Provider>;
};
