import React from 'react';
import { text } from '@storybook/addon-knobs';
import { withForm } from '~/components/Form/Form.decorator';
import { RadioButtons } from './RadioButtons';

export default {
  title: 'Forms|RadioButtons',
  decorators: [withForm()],
};

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry', disabled: true },
  { value: 'vanilla', label: 'Vanilla' },
];

export const Default: React.FC = () => {
  return <RadioButtons name="checkbox" label={text('label', "I'm the group label")} options={options} />;
};
