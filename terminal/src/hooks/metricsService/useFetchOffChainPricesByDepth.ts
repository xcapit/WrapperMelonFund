import { useQuery } from 'react-query';
import { Depth } from '~/components/Charts/types';

export interface DepthTimelineItem {
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

async function fetchOffchainHistoryByDepth(key: string, fund: string, depth: Depth) {
  const api = process.env.MELON_METRICS_API;
  const url = `${api}/api/depth/offchain?address=${fund}&depth=${depth}`;
  const response = await fetch(url).then((res) => res.json());
  return response;
}

export function useFetchOffchainPricesByDepth(fund: string, depth: number | Depth) {
  const address = fund.toLowerCase();
  const key = 'offchainPrices';
  return useQuery([key, address, depth as Depth], fetchOffchainHistoryByDepth, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 10,
    enabled: typeof depth === 'string' && (depth === '1d' || depth === '1w'),
  });
}
