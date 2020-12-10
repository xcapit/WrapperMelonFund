import React from 'react';
import { text } from '@storybook/addon-knobs';
import { TokenDefinition } from '@melonproject/melonjs';
import { withForm } from '~/components/Form/Form.decorator';
import { TokenValueSelect } from './TokenValueSelect';

export default {
  title: 'Forms|TokenValueSelect',
  decorators: [withForm()],
};

const tokens = [
  {
    address: '0x0000000000000000000000000000000000000001',
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
  },
  {
    address: '0x0000000000000000000000000000000000000002',
    symbol: 'MLN',
    name: 'Melon',
    decimals: 18,
  },
  {
    address: '0x0000000000000000000000000000000000000003',
    symbol: 'SAI',
    name: 'Sai',
    decimals: 9,
  },
] as TokenDefinition[];

export const Default = () => (
  <TokenValueSelect name="tokenSelect" label={text('label', "I'm a label")} tokens={tokens} />
);
