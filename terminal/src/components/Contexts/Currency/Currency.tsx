import React, { useState, createContext } from 'react';
import { useRates } from '../Rates/Rates';
import { Rates, RatesItem } from '~/utils/fetchRates';

export const currencyList = [
  { symbol: 'USD', name: 'US Dollar' },
  { symbol: 'ETH', name: 'Ether' },
  { symbol: 'BTC', name: 'Bitcoin' },
] as const;

export type CurrencySymbol = typeof currencyList[number];

export interface CurrencyContext {
  currency: string;
  list: typeof currencyList;
  rates: RatesItem;
  switch: (currency: string) => void;
}

export const getRate = (rates: { [key: string]: number }, currency: string): number => {
  return currency === 'USD' ? rates?.['USDC'] || rates?.['DAI'] : currency === 'BTC' ? rates?.['WBTC'] : 1;
};

export const Currency = createContext<CurrencyContext>({} as CurrencyContext);

export const CurrencyProvider: React.FC = (props) => {
  const [currency, setCurrency] = useState<string>('USD');

  const list = currencyList;

  const rates = useRates() as Rates;

  const context: CurrencyContext = {
    currency,
    list,
    rates: rates?.[currency],
    switch: (currency) => setCurrency(currency),
  };
  return <Currency.Provider value={context}>{props.children}</Currency.Provider>;
};
