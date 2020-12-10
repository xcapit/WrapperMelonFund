import React from 'react';

import { Pagination } from './Pagination';

export default { title: 'Components|Pagination' };

export const Default = () => (
  <Pagination
    hasPrevious={false}
    hasNext={false}
    previous={() => {}}
    next={() => {}}
    first={() => {}}
    last={() => {}}
    goTo={() => {}}
    actual={3}
    totalItems={123}
  />
);
