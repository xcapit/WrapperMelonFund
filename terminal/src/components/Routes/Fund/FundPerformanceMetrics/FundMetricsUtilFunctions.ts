import { BigNumber } from 'bignumber.js';
import { endOfMonth, subMonths, addMonths, addMinutes } from 'date-fns';
import { MonthendTimelineItem } from '~/hooks/metricsService/useFetchFundPricesByMonthEnd';

export interface DisplayData {
  label?: string;
  date: Date;
  return: BigNumber;
}

export interface MonthlyReturnData {
  data: DisplayData[];
}

/**
 * Takes an array of MonthEndTimeLineItems (data from the last day of each month, in sequence) and returns an array of
 * month on month returns as BigNumbers. These returns are not calculated locally, but rather at the metrics microservice.
 * This function merely rearranges this data into DisplayData
 * @param monthlyReturnData the data returned from a monthend call to our metrics service
 * @param dayZeroFx an object with the ethusd, etheur, and ethbtc VWAP prices from the day of the fund's inception
 * optional params: for generating the empty padding arrays to display in a table
 * @param today Today as a date.
 * @param activeMonths The total number of months a fund has been active
 * @param monthsBeforeFund The months before the fund was created in the year the fund was created,
 * @param monthsRemaining The months remaining in the current year
 */

export function monthlyReturnsFromTimeline(
  monthlyReturnData: MonthendTimelineItem[] = [],
  currency: string,
  today?: Date,
  activeMonths?: number,
  monthsBeforeFund?: number,
  monthsRemaining?: number
): MonthlyReturnData {
  const activeMonthReturns: DisplayData[] = monthlyReturnData.map((item: MonthendTimelineItem) => {
    const rtrn = new BigNumber(item.monthlyReturns?.[currency]);

    const rawDate = new Date(item.timestamp * 1000);
    const date = addMinutes(rawDate, rawDate.getTimezoneOffset());

    return {
      return: rtrn,
      date,
    };
  });

  // in general, the first item should be removed
  // When fund was started on the last day of the month, however, we keep that first item
  if (activeMonthReturns.length > 1) {
    if (activeMonthReturns[0].date.getMonth() === activeMonthReturns[1].date.getMonth()) {
      activeMonthReturns.shift();
    }
  }

  const inactiveMonthReturns: DisplayData[] | undefined =
    today && monthsBeforeFund && activeMonths
      ? new Array(monthsBeforeFund)
          .fill(null)
          .map((_, index: number) => {
            return {
              date: endOfMonth(subMonths(today, index + activeMonths)),
              return: new BigNumber('NaN'),
            } as DisplayData;
          })
          .reverse()
      : undefined;

  const monthsRemainingInYear: DisplayData[] | undefined =
    today && monthsRemaining
      ? new Array(monthsRemaining).fill(null).map((item, index: number) => {
          return { date: endOfMonth(addMonths(today, index + 1)), return: new BigNumber('NaN') } as DisplayData;
        })
      : [];

  const aggregatedMonthlyReturns =
    inactiveMonthReturns && monthsRemainingInYear
      ? inactiveMonthReturns.concat(activeMonthReturns).concat(monthsRemainingInYear)
      : activeMonthReturns;

  return { data: aggregatedMonthlyReturns };
}
