import { useContext } from 'react';
import { FundList } from '~/components/Contexts/FundList/FundList';

export function useFundList() {
  return useContext(FundList);
}
