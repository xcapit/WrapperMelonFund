import React from 'react';
import { DataBlock, DataBlockSection } from './DataBlock';

export default { title: 'Components|DataBlock' };

export const Default = () => <DataBlock label="quantity">10000</DataBlock>;

export const WrappedInSection = () => {
  return (
    <DataBlockSection>
      <DataBlock label="quantity">10000</DataBlock>
      <DataBlock label="AUM">0.1000 WETH</DataBlock>
      <DataBlock label="Creation date">02.Mar 2019 00:52</DataBlock>
    </DataBlockSection>
  );
};
