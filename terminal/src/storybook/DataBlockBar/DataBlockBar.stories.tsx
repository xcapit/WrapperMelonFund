import React from 'react';
import { DataBlockBar, DataBlockBarContent } from './DataBlockBar';
import { DataBlock } from '../DataBlock/DataBlock';

export default { title: 'Bar|DataBlockBar' };

export const Deafult: React.FC = () => {
  return (
    <DataBlockBar>
      <DataBlockBarContent justify="between">
        <DataBlock label="Share Price">1.0000000 WETH/Share</DataBlock>
        <DataBlock label="AUM">0.1000 WETH</DataBlock>
        <DataBlock label="Creation date">02.Mar 2019 00:52</DataBlock>
        <DataBlock label="Total number of shares">0.1000000</DataBlock>
        <DataBlock label="Shares owned by me">0.1000000</DataBlock>
        <DataBlock label="Management fee">0.5%</DataBlock>
        <DataBlock label="Performance fee">0%</DataBlock>
        <DataBlock label="Performance fee period">90 days</DataBlock>
      </DataBlockBarContent>
    </DataBlockBar>
  );
};
