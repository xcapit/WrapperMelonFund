import { useContext } from 'react';
import { Connection } from '~/components/Contexts/Connection/Connection';

export function useConnectionState() {
  return useContext(Connection);
}
