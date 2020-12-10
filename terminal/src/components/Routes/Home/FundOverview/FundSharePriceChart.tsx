import React from 'react';
import BigNumber from 'bignumber.js';
import ReactApexChart from 'react-apexcharts';
import styled, { useTheme } from 'styled-components';

import { useFetchFundPricesByDepth } from '~/hooks/metricsService/useFetchFundPricesByDepth';
import { DepthTimelineItem } from '~/hooks/metricsService/useFetchOffChainPricesByDepth';
import { useCurrency } from '~/hooks/useCurrency';
import { getRate } from '~/components/Contexts/Currency/Currency';

export interface FundSharePriceChartProps {
  address: string;
}

export const Chart = styled.div`
  // display: flex;
  // flex-direction: column;
  vertical-align: bottom;
  height: 60px;
  float: right;
`;

export const FundSharePriceChart: React.FC<FundSharePriceChartProps> = (props) => {
  const theme = useTheme();
  const currency = useCurrency();

  const { data, error } = useFetchFundPricesByDepth(props.address, '1m');

  if (!data) {
    return <></>;
  }

  if (error) {
    return <>Error</>;
  }

  const dataArray = data.data
    .filter((item: DepthTimelineItem) => item.calculations.gav > 0)
    .map((item: DepthTimelineItem) => ({
      x: new Date(item.timestamp * 1000),
      y: new BigNumber(item.calculations.price).dividedBy(getRate(item.rates, currency.currency)).toPrecision(8),
    }));

  const series = [
    {
      id: 'sharePrice',
      name: 'Share price',
      data: dataArray,
    },
  ];

  const options = {
    colors: ['#aaaaaa'],
    chart: {
      animations: {
        enabled: false,
      },
      type: 'line',
      sparkline: {
        enabled: true,
      },
    },

    stroke: {
      width: 2,
      curve: 'smooth',
    },

    xaxis: {
      type: 'datetime',
    },

    grid: {
      padding: {
        top: 10,
        bottom: 3,
      },
    },

    tooltip: {
      enabled: false,
      theme: theme.mode,
      x: {
        format: 'dd-MM-yyyy',
      },
      marker: {
        show: false,
      },
    },
  };

  return (
    <Chart>
      <ReactApexChart options={options} series={series} type="line" width={100} height={40} />
    </Chart>
  );
};
