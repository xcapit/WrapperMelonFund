import { useQuery } from 'react-query';
import { Depth } from '~/components/Charts/types';

async function fetchFundPricesByDepth(key: string, fund: string, depth: Depth) {
  const api = process.env.MELON_METRICS_API;
  const url = `${api}/api/depth/onchain?address=${fund}&depth=${depth}`;
  const response = await fetch(url).then((res) => res.json());
  return response;
}

export function useFetchFundPricesByDepth(fund: string, depth: Depth) {
  const address = fund.toLowerCase();
  const key = 'depth';
  return useQuery([key, address, depth], fetchFundPricesByDepth, {
    refetchOnMount: false,
    staleTime: 1000 * 60 * 10,
    enabled: typeof depth === 'string',
  });
}
