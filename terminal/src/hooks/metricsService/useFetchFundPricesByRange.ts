import { useQuery } from 'react-query';
import React from 'react';
import { Depth } from '~/components/Charts/types';
import { findCorrectToTime } from '~/utils/priceServiceDates';

export interface RangeTimelineItem {
  timestamp: number;
  rates: {
    [symbol: string]: number;
  };
  holdings: {
    [symbol: string]: number;
  };
  shares: number;
  calculations: {
    price: number;
    gav: number;
    nav: number;
  };
}
async function fetchFundPricesByRange(key: string, address: string, from: number, to: number) {
  const url = process.env.MELON_METRICS_API;
  const queryAddress = `${url}/api/range?address=${address}&from=${from}&to=${to}`;
  const response = await fetch(queryAddress).then((response) => response.json());
  return response;
}

export function useFetchFundPricesByRange(fund: string, from: number | Depth) {
  const today = React.useMemo(() => findCorrectToTime(new Date()), []);
  const address = fund.toLowerCase();
  const key = 'range';

  return useQuery([key, address, from as number, today], fetchFundPricesByRange, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 10,
    enabled: typeof from === 'number',
  });
}
