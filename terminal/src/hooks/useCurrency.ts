import { useContext } from 'react';
import { Currency } from '~/components/Contexts/Currency/Currency';

export function useCurrency() {
  return useContext(Currency);
}
