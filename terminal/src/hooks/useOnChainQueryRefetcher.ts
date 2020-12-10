import { useOnChainClient } from './useQuery';
import { useCallback } from 'react';
import { refetchQueries } from '~/utils/refetchQueries';

export function useOnChainQueryRefetcher() {
  const client = useOnChainClient();

  return useCallback(
    (block?: number, names?: string[]) => {
      return refetchQueries(client, block, names);
    },
    [client]
  );
}
