import { useContext } from 'react';
import { Fund } from '~/components/Contexts/Fund/Fund';

export function useFund() {
  return useContext(Fund);
}
