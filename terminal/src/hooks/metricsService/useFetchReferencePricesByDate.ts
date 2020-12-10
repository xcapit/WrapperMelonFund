import { findCorrectToTime } from '~/utils/priceServiceDates';
import { useQuery } from 'react-query';

async function fetchReferencePricesByDate(key: string, date: number) {
  const url = process.env.MELON_RATES_API;
  const btcQueryAddress = `${url}/api/day-average?base=ETH&quote=BTC&day=${date}`;
  const usdQueryAddress = `${url}/api/day-average?base=ETH&quote=USD&day=${date}`;
  const eurQueryAddress = `${url}/api/day-average?base=ETH&quote=EUR&day=${date}`;

  try {
    const [btcResponse, usdResponse, eurResponse] = await Promise.all([
      fetch(btcQueryAddress).then((response) => response.json()),
      fetch(usdQueryAddress).then((response) => response.json()),
      fetch(eurQueryAddress).then((response) => response.json()),
    ]);

    return {
      ethbtc: btcResponse.data.rate,
      ethusd: usdResponse.data.rate,
      etheur: eurResponse.data.rate,
    };
  } catch (error) {
    throw error;
  }
}

export function useFetchReferencePricesByDate(date: Date) {
  const day = findCorrectToTime(date);
  const key = 'referencePricesByDate';
  return useQuery([key, day], fetchReferencePricesByDate, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 10,
  });
}
