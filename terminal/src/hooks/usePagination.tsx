import { useMemo, useState } from 'react';

export function usePagination(data: any[] = [], limit: number = 20, start: number = 0) {
  const [offset, setOffset] = useState<number>(start);

  const paginatedData = useMemo(() => {
    return data && data.slice(offset, offset + limit);
  }, [data, offset]);

  return {
    offset,
    setOffset,
    data: paginatedData,
  };
}
