import React from 'react';
import ReactApexChart from 'react-apexcharts';
import styled, { useTheme } from 'styled-components';
import * as S from './PriceChart.styles';
import { ZoomControl } from '../ZoomControl/ZoomControl';
import { Serie, Depth } from '~/components/Charts/types';

export interface PriceChartProps {
  depth: number | Depth;
  data: Serie[];
  secondary?: Serie[];
  setDepth: (depth: number | Depth) => void;
  inception: Date;
}

const ChartDescription = styled.span`
  text-align: left;
  color: ${(props) => props.theme.mainColors.secondaryDark};
  font-size: ${(props) => props.theme.fontSizes.s};
  margin-bottom: ${(props) => props.theme.spaceUnits.m};
  margin-left: 0;
`;

export const PriceChart: React.FC<PriceChartProps> = (props) => {
  const theme = useTheme();
  const data = React.useMemo(() => [...props.data, ...(props.secondary ?? [])], [props.data, props.secondary]);
  const curveType = props.depth === '1w' || props.depth === '1d' ? ['stepline', 'smooth'] : ['smooth'];
  const options = {
    chart: {
      animations: {
        enabled: false,
      },
      type: 'area',
      stacked: false,
      height: 'auto',
      fontFamily: theme.fontFamilies,
      foreColor: theme.mainColors.textColor,
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
        autoSelected: 'zoom',
        tools: {
          download: false,
        },
      },
    },
    colors: ['rgb(133,213,202)', '#aaaaaa'],
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: ['gradient', 'solid'],
      gradient: {
        shadeIntensity: 0.5,
      },
    },
    grid: {
      strokeDashArray: 4,
      borderColor: '#90A4AE',
    },
    legend: {
      showForSingleSeries: false,
    },
    markers: {
      size: [2, 0],
      colors: ['rgb(133,213,202)', '#aaaaaa'],
    },
    yaxis: {
      title: {
        text: 'Share Price',
      },
      decimalsInFloat: 4,
    },
    xaxis: {
      type: 'datetime',
    },
    stroke: {
      width: [3, 1],
      curve: curveType,
    },
    tooltip: {
      shared: true,
      theme: theme.mode,
      x: {
        format: 'dd-MM-yyyy',
      },
    },
  };

  return (
    <>
      <ZoomControl inception={props.inception} depth={props.depth} setDepth={props.setDepth} />

      <S.Chart>
        <ReactApexChart options={options} series={data} type="area" height={350} />

        {props.depth === '1w' || props.depth === '1d' ? (
          <ChartDescription>
            On-chain prices are updated once daily and used for all fund accounting functions. The interim prices
            displayed here are from an off-chain source and are for descriptive purposes only to show intra-update
            fluctuations. Because of the way they're observed, there may be small differences between onchain and
            offchain prices.
          </ChartDescription>
        ) : null}
      </S.Chart>
    </>
  );
};
