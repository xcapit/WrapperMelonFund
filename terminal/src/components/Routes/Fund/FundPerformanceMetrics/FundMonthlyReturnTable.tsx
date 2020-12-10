import * as React from 'react';
import {
  Table,
  HeaderRow,
  BodyRow,
  BodyCell,
  ScrollableTable,
  BodyCellRightAlign,
  HeaderCellRightAlign,
} from '~/storybook/Table/Table';
import {
  subYears,
  format,
  differenceInCalendarMonths,
  startOfYear,
  differenceInCalendarYears,
  endOfYear,
  addMonths,
  differenceInCalendarDays,
} from 'date-fns';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { useFund } from '~/hooks/useFund';
import { Block } from '~/storybook/Block/Block';
import { Spinner } from '~/storybook/Spinner/Spinner';
import { SectionTitle } from '~/storybook/Title/Title';
import { useFetchFundPricesByMonthEnd } from '~/hooks/metricsService/useFetchFundPricesByMonthEnd';
import { MonthlyReturnData, monthlyReturnsFromTimeline } from './FundMetricsUtilFunctions';
import { NotificationBar, NotificationContent } from '~/storybook/NotificationBar/NotificationBar';
import { useCurrency } from '~/hooks/useCurrency';

export interface MonthlyReturnTableProps {
  address: string;
}

interface SelectItem {
  value: keyof MonthlyReturnData['data'];
  label: string;
}

export const FundMonthlyReturnTable: React.FC<MonthlyReturnTableProps> = ({ address }) => {
  const today = React.useMemo(() => new Date(), []);
  const fund = useFund();
  const currency = useCurrency();

  const fundInception = fund.creationTime!;

  const activeYears = React.useMemo(() => {
    return new Array(differenceInCalendarYears(today, fundInception) + 1)
      .fill(null)
      .map((item, index) => subYears(today, index))
      .reverse()
      .map((date) => date.getFullYear());
  }, [fund]);

  const { data: monthlyData, error: monthlyError } = useFetchFundPricesByMonthEnd(address);

  const firstDate = new Date(fundInception.getTime());
  const lastDate = new Date(monthlyData?.data?.[monthlyData?.data?.length - 1]?.timestamp * 1000);

  const monthsBeforeFund = differenceInCalendarMonths(firstDate, startOfYear(new Date(activeYears[0], 1, 1)));

  const monthsRemaining = differenceInCalendarMonths(endOfYear(today), lastDate);
  const activeMonths = fund && differenceInCalendarMonths(lastDate, firstDate) + 1;

  const tableData: MonthlyReturnData | undefined = React.useMemo(() => {
    if (!monthlyData || !fund) {
      return undefined;
    }

    return monthlyReturnsFromTimeline(
      monthlyData.data ?? [{}],
      currency.currency,
      lastDate,
      activeMonths,
      monthsBeforeFund,
      monthsRemaining
    );
  }, [fund, monthlyData, currency.currency]);

  const months = React.useMemo(() => {
    return new Array(12).fill(null).map((_, index) => {
      const january = startOfYear(today);
      return format(addMonths(january, index), 'MMM');
    });
  }, []);

  if (!tableData) {
    return (
      <Block>
        <SectionTitle>Monthly Returns [{currency.currency}]</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  if (monthlyError || monthlyData?.errors) {
    return (
      <Block>
        <SectionTitle>Monthly Returns [{currency.currency}]</SectionTitle>
        <NotificationBar kind="error">
          <NotificationContent>There was an unexpected error fetching fund data.</NotificationContent>
        </NotificationBar>
      </Block>
    );
  }

  return (
    <Block>
      <SectionTitle>Monthly Returns [{currency.currency}]</SectionTitle>

      <ScrollableTable>
        <Table>
          <tbody>
            <HeaderRow>
              <HeaderCellRightAlign>{'             '}</HeaderCellRightAlign>
              {months.map((month, index) => (
                <HeaderCellRightAlign key={index}>{month}</HeaderCellRightAlign>
              ))}
            </HeaderRow>

            {activeYears.map((year) => {
              return (
                <BodyRow key={year}>
                  <BodyCell>{year}</BodyCell>
                  {tableData
                    .data!.filter((item) => item.date.getFullYear() === year)
                    .map((item, index) => (
                      <BodyCellRightAlign key={index}>
                        {item.return && !item.return.isNaN() ? (
                          <>
                            <FormattedNumber suffix={'%'} value={item.return} decimals={2} colorize={true} />
                          </>
                        ) : (
                          <>
                            <span>-</span>
                          </>
                        )}
                      </BodyCellRightAlign>
                    ))}
                </BodyRow>
              );
            })}
          </tbody>
        </Table>
      </ScrollableTable>
    </Block>
  );
};
