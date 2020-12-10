import React from 'react';
import BigNumber from 'bignumber.js';
import { Block } from '~/storybook/Block/Block';
import { SectionTitle } from '~/storybook/Title/Title';
import { Spinner } from '~/storybook/Spinner/Spinner';
import { PriceChart } from '~/components/Charts/PriceChart/PriceChart';
import { useFund } from '~/hooks/useFund';
import { Depth, Serie } from '~/components/Charts/types';
import { useFetchOffchainPricesByDepth, DepthTimelineItem } from '~/hooks/metricsService/useFetchOffChainPricesByDepth';
import { useFetchFundPricesByDepth } from '~/hooks/metricsService/useFetchFundPricesByDepth';
import { useFetchFundPricesByRange } from '~/hooks/metricsService/useFetchFundPricesByRange';
import { NotificationBar, NotificationContent } from '~/storybook/NotificationBar/NotificationBar';
import { useCurrency } from '~/hooks/useCurrency';
import { getRate } from '~/components/Contexts/Currency/Currency';

export interface NewFundPerformanceChartProps {
  address: string;
}

export const NewFundPerformanceChart: React.FC<NewFundPerformanceChartProps> = (props) => {
  const fund = useFund();
  const [depth, setDepth] = React.useState<Depth | number>('1m');
  const currency = useCurrency();

  const {
    data: onchainDataByDepth,
    error: onchainDataByDepthError,
    isFetching: onchainDataByDepthFetching,
  } = useFetchFundPricesByDepth(props.address, depth as Depth);

  const {
    data: offchainDataByDepth,
    error: offchainDataByDepthError,
    isFetching: offchainDataByDepthFetching,
  } = useFetchOffchainPricesByDepth(props.address, depth);

  const {
    data: onchainDataByDate,
    error: onchainDataByDateError,
    isFetching: onchainDataByDateFetching,
  } = useFetchFundPricesByRange(props.address, depth);

  if (onchainDataByDateError || onchainDataByDepthError || offchainDataByDepthError) {
    return (
      <Block>
        <SectionTitle>Share Price [{currency.currency}]</SectionTitle>
        <NotificationBar kind="error">
          <NotificationContent>There was an unexpected error fetching fund data.</NotificationContent>
        </NotificationBar>
      </Block>
    );
  }

  const formattedOnchainDataByDepth = React.useMemo(() => {
    if (!onchainDataByDepth) {
      return undefined;
    }

    const dataArray = (onchainDataByDepth.data || []).map((item: DepthTimelineItem) => ({
      x: new Date(item.timestamp * 1000),
      y:
        item.calculations.gav > 0
          ? new BigNumber(item.calculations.price).dividedBy(getRate(item.rates, currency.currency)).toPrecision(8)
          : null,
    }));

    if (dataArray.length && (depth === '1d' || depth === '1w')) {
      dataArray.push({
        x: new Date(),
        y: dataArray[dataArray.length - 1].y,
      });
    }

    return [
      {
        id: 'on-chain',
        name: 'On-chain share price',
        type: 'area',
        data: dataArray,
      },
    ] as Serie[];
  }, [onchainDataByDepth, currency.currency]);

  const formattedOffchainDataByDepth = React.useMemo(() => {
    if (!offchainDataByDepth) {
      return undefined;
    }

    const dataArray = (offchainDataByDepth.data || []).map((item: DepthTimelineItem) => ({
      x: new Date(item.timestamp * 1000),
      y:
        item.calculations.gav > 0
          ? new BigNumber(item.calculations.price).dividedBy(getRate(item.rates, currency.currency)).toPrecision(8)
          : null,
    }));

    return [
      {
        id: 'off-chain',
        name: 'Interim share price movements',
        type: 'line',
        data: dataArray,
      },
    ] as Serie[];
  }, [offchainDataByDepth, currency.currency]);

  const formattedOnchainDataByDate = React.useMemo(() => {
    if (!onchainDataByDate) {
      return undefined;
    }

    const dataArray = (onchainDataByDate.data || []).map((item: DepthTimelineItem) => ({
      x: new Date(item.timestamp * 1000),
      y:
        item.calculations.gav > 0
          ? new BigNumber(item.calculations.price).dividedBy(getRate(item.rates, currency.currency)).toPrecision(8)
          : null,
    }));

    return [
      {
        id: 'on-chain',
        name: 'On-chain share price',
        type: 'area',
        data: dataArray,
      },
    ] as Serie[];
  }, [onchainDataByDate, currency.currency]);

  const data = formattedOnchainDataByDepth ?? formattedOnchainDataByDate ?? ([] as Serie[]);
  if (!data.length && (onchainDataByDateFetching || onchainDataByDepthFetching)) {
    return (
      <Block>
        <SectionTitle>Share Price [{currency.currency}]</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  return (
    <Block>
      <SectionTitle>Share Price [{currency.currency}]</SectionTitle>
      <PriceChart
        setDepth={setDepth}
        depth={depth}
        data={data}
        secondary={formattedOffchainDataByDepth}
        inception={fund.creationTime!}
      />
    </Block>
  );
};
