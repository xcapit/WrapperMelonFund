import { useContext } from 'react';
import { Account } from '~/components/Contexts/Account/Account';

export function useAccount() {
  return useContext(Account);
}
