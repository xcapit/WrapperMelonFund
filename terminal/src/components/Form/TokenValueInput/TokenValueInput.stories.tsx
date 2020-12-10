import React from 'react';
import { text } from '@storybook/addon-knobs';
import { TokenDefinition } from '@melonproject/melonjs';
import { withForm } from '~/components/Form/Form.decorator';
import { TokenValueInput } from './TokenValueInput';

export default {
  title: 'Forms|TokenValueInput',
  decorators: [withForm()],
};

const token = {
  address: '0x0000000000000000000000000000000000000001',
  symbol: 'WETH',
  name: 'Wrapped Ether',
  decimals: 18,
} as TokenDefinition;

export const Default = () => <TokenValueInput name="tokenInput" label={text('label', "I'm a label")} />;
