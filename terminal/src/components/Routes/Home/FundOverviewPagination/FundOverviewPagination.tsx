import React from 'react';

import { Pagination } from '~/storybook/Pagination/Pagination';

export interface FundOverviewPaginationProps {
  offset: number;
  setOffset: (value: number) => void;
  funds: number;
}

export const FundOverviewPagination: React.FC<FundOverviewPaginationProps> = ({ offset, setOffset, funds }) => {
  return (
    <Pagination
      hasPrevious={offset <= 0}
      hasNext={offset + 15 >= funds}
      previous={() => setOffset(offset - 15)}
      next={() => setOffset(offset + 15)}
      first={() => setOffset(0)}
      last={() => setOffset(funds - (funds % 15))}
      goTo={(page: number) => setOffset(page * 15)}
      actual={offset / 15 + 1}
      totalItems={funds}
      position="flex-end"
    />
  );
};
