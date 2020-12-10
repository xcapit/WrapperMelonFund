import { useQuery } from 'react-query';

async function fetchFundList(key: string) {
  const api = process.env.MELON_METRICS_API;
  const url = `${api}/api/fundlist`;
  const response = await fetch(url).then((res) => res.json());
  return response;
}

export function useFetchFundList() {
  const key = 'fundList';
  return useQuery([key], fetchFundList, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 10,
  });
}
