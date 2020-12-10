import * as React from 'react';
import BigNumber from 'bignumber.js';
import { startOfYear, startOfMonth, startOfQuarter, differenceInCalendarDays, isSameDay } from 'date-fns';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { useFund } from '~/hooks/useFund';
import { useFetchFundPricesByMonthEnd } from '~/hooks/metricsService/useFetchFundPricesByMonthEnd';
import { useFetchFundPricesByRange, RangeTimelineItem } from '~/hooks/metricsService/useFetchFundPricesByRange';
import { monthlyReturnsFromTimeline, DisplayData } from './FundMetricsUtilFunctions';
import { DictionaryEntry, DictionaryLabel, DictionaryData } from '~/storybook/Dictionary/Dictionary';
import { SectionTitle } from '~/storybook/Title/Title.styles';
import { NotificationBar, NotificationContent } from '~/storybook/NotificationBar/NotificationBar';
import { Tooltip } from '~/storybook/Tooltip/Tooltip';
import { Block } from '~/storybook/Block/Block';
import { Spinner } from '~/storybook/Spinner/Spinner';
import { findCorrectFromTime } from '~/utils/priceServiceDates';
import { average, calculateVolatility } from '~/utils/finance';
import { useCurrency } from '~/hooks/useCurrency';
import { getRate } from '~/components/Contexts/Currency/Currency';

export interface FundSharePriceMetricsProps {
  address: string;
}

function findLastQuarter(utcMonth: number): number {
  let month = 0;
  for (let i = utcMonth; i >= 0; i--) {
    if (i % 3 === 0) {
      month = i;
      break;
    }
  }
  return month;
}

export const FundSharePriceMetrics: React.FC<FundSharePriceMetricsProps> = (props) => {
  const today = React.useMemo(() => new Date(), []);
  const currency = useCurrency();

  const fund = useFund();

  const fundInceptionDate = findCorrectFromTime(fund.creationTime!);

  const {
    data: historicalData,
    error: historicalDataError,
    isFetching: historicalDataFetching,
  } = useFetchFundPricesByRange(fund.address!, fundInceptionDate);

  const { data: monthlyData, error: monthlyError, isFetching: monthlyFetching } = useFetchFundPricesByMonthEnd(
    fund.address!
  );

  const monthlyReturns = React.useMemo(() => {
    return monthlyData?.data && monthlyReturnsFromTimeline(monthlyData.data, currency.currency);
  }, [monthlyData?.data, currency.currency]);

  const utcYear = today.getUTCFullYear();
  const utcMonth = today.getUTCMonth();
  const dayInMilliseconds = 24 * 60 * 60 * 1000;
  const lastMonthendDate: number = (Date.UTC(utcYear, utcMonth) - dayInMilliseconds) / 1000;
  const lastQuarterendDate: number = (Date.UTC(utcYear, findLastQuarter(utcMonth)) - dayInMilliseconds) / 1000;
  const lastYearendDate: number = (Date.UTC(utcYear, 0) - dayInMilliseconds) / 1000;

  const mtdReturn = React.useMemo(
    () => monthlyData?.data?.[monthlyData.data?.length - 1]?.holdingPeriodReturns.monthToDate[currency.currency],
    [monthlyData, currency.currency]
  );

  const qtdReturn = React.useMemo(
    () => monthlyData?.data?.[monthlyData.data?.length - 1]?.holdingPeriodReturns.quarterToDate[currency.currency],
    [monthlyData, currency.currency]
  );

  const ytdReturn = React.useMemo(
    () => monthlyData?.data?.[monthlyData.data?.length - 1]?.holdingPeriodReturns.yearToDate[currency.currency],
    [monthlyData, currency.currency]
  );

  const filteredReturns = monthlyReturns?.data?.filter((item) => !item.return.isNaN()) || [];

  const bestMonth = React.useMemo(() => {
    return filteredReturns.reduce((carry: DisplayData, current: DisplayData) => {
      if (current.return.isGreaterThan(carry.return)) {
        return current;
      }
      return carry;
    }, filteredReturns[0]);
  }, [filteredReturns, currency.currency]);

  const worstMonth = React.useMemo(() => {
    return filteredReturns.reduce((carry: DisplayData, current: DisplayData) => {
      if (current.return.isLessThan(carry.return)) {
        return current;
      }
      return carry;
    }, filteredReturns[0]);
  }, [filteredReturns, currency.currency]);

  const monthlyWinLoss = React.useMemo(() => {
    return (
      filteredReturns.reduce(
        (carry: { win: number; lose: number }, current: DisplayData) => {
          if (current.return.isGreaterThan(0)) {
            carry.win++;
            return carry;
          }
          carry.lose++;
          return carry;
        },
        { win: 0, lose: 0 }
      ) || { win: 0, lose: 0 }
    );
  }, [filteredReturns, currency.currency]);

  const averageMonthlyReturn = React.useMemo(() => {
    return (
      monthlyReturns && average(monthlyReturns.data.filter((item) => !item.return.isNaN()).map((month) => month.return))
    );
  }, [monthlyReturns, currency.currency]);

  const volSampleTime =
    differenceInCalendarDays(today, fund.creationTime!) > 30 ? 30 : differenceInCalendarDays(today, fund.creationTime!);

  const sampleVol = React.useMemo(() => {
    return (
      historicalData &&
      volSampleTime &&
      calculateVolatility(
        historicalData.data
          .slice(volSampleTime, historicalData.data.length - 1)
          .filter((item: RangeTimelineItem) => item.calculations.gav > 0)
          .map((item: RangeTimelineItem) =>
            new BigNumber(item.calculations.price).dividedBy(getRate(item.rates, currency.currency))
          )
      )
    );
  }, [volSampleTime, historicalData, currency.currency]);

  if (historicalDataError || monthlyError || monthlyData?.errors?.length) {
    return (
      <Block>
        <SectionTitle>Share Price Metrics [{currency.currency}]</SectionTitle>
        <NotificationBar kind="error">
          <NotificationContent>There was an unexpected error fetching fund data.</NotificationContent>
        </NotificationBar>
      </Block>
    );
  }

  if ((!historicalData && historicalDataFetching) || (!monthlyData && monthlyFetching)) {
    return (
      <Block>
        <SectionTitle>Share Price Metrics [{currency.currency}]</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  return (
    <Block>
      <SectionTitle>Share Price Metrics [{currency.currency}]</SectionTitle>{' '}
      <DictionaryEntry>
        <DictionaryLabel>MTD</DictionaryLabel>
        {isSameDay(today, startOfMonth(today)) ? (
          <DictionaryData> - </DictionaryData>
        ) : (
          <DictionaryData textAlign={'right'}>
            <FormattedNumber decimals={2} value={mtdReturn} suffix={'%'} />
          </DictionaryData>
        )}
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>QTD</DictionaryLabel>
        {isSameDay(today, startOfQuarter(today)) ? (
          <DictionaryData> - </DictionaryData>
        ) : (
          <DictionaryData textAlign={'right'}>
            <FormattedNumber decimals={2} value={qtdReturn} suffix={'%'} />
          </DictionaryData>
        )}
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>YTD</DictionaryLabel>
        {isSameDay(today, startOfYear(today)) ? (
          <DictionaryData> - </DictionaryData>
        ) : (
          <DictionaryData textAlign={'right'}>
            <FormattedNumber decimals={2} value={ytdReturn} suffix={'%'} />
          </DictionaryData>
        )}
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>&nbsp;</DictionaryLabel>
        <DictionaryData textAlign={'right'}>&nbsp;</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Best Month</DictionaryLabel>
        <DictionaryData textAlign={'right'}>
          <FormattedNumber decimals={2} value={bestMonth?.return} suffix={'%'} />
        </DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Average Month</DictionaryLabel>
        <DictionaryData textAlign={'right'}>
          <FormattedNumber decimals={2} value={averageMonthlyReturn} suffix={'%'} />
        </DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Worst Month</DictionaryLabel>
        <DictionaryData textAlign={'right'}>
          <FormattedNumber decimals={2} value={worstMonth?.return} suffix={'%'} />
        </DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Positive Months</DictionaryLabel>
        <DictionaryData textAlign={'right'}>
          {monthlyWinLoss.win} of {monthlyWinLoss.win + monthlyWinLoss.lose}
        </DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Track Record</DictionaryLabel>
        <DictionaryData textAlign={'right'}>
          <FormattedNumber value={monthlyWinLoss.win + monthlyWinLoss.lose} decimals={0} /> months
        </DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>&nbsp;</DictionaryLabel>
        <DictionaryData textAlign={'right'}>&nbsp;</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>
          <Tooltip
            placement="auto"
            value={`${volSampleTime}-day volatility of fund share price in ${currency.currency}`}
          >
            Volatility
          </Tooltip>
        </DictionaryLabel>
        <DictionaryData textAlign={'right'}>
          <FormattedNumber decimals={2} value={sampleVol} suffix={'%'} />
        </DictionaryData>
      </DictionaryEntry>
    </Block>
  );
};
