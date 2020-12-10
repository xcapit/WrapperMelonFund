import React from 'react';
import * as R from 'ramda';
import { withForm } from '~/components/Form/Form.decorator';
import { Select, SelectOption } from './Select';

export default {
  title: 'Forms|Select',
  decorators: [withForm()],
};

const omit = (options: SelectOption[], ...keys: string[]) => {
  return options.map((item) => R.omit(keys, item)) as SelectOption[];
};

const options = [
  { value: 'chocolate', label: 'Chocolate', icon: 'RLC', description: 'RLC Token' },
  { value: 'strawberry', label: 'Strawberry', icon: 'REP', description: 'REP Token' },
  { value: 'vanilla', label: 'Vanilla', icon: 'WBTC', description: 'WBTC Token' },
];

export const Default = () => <Select options={omit(options, 'description', 'icon')} name="select" />;

export const Multiple = () => <Select options={omit(options, 'description', 'icon')} name="select" isMulti={true} />;

export const WithIcon = () => <Select options={omit(options, 'description')} name="select" />;

export const WithIconMultiple = () => <Select options={omit(options, 'description')} name="select" isMulti={true} />;

export const WithDescription = () => <Select options={omit(options, 'icon')} name="select" />;

export const WithDescriptionMultiple = () => <Select options={options} name="select" isMulti={true} />;
