import React from 'react';
import { text } from '@storybook/addon-knobs';
import { withForm } from '~/components/Form/Form.decorator';
import { Checkbox } from './Checkbox';

export default {
  title: 'Forms|Checkbox',
  decorators: [withForm()],
};

export const Default: React.FC = () => {
  return <Checkbox name="checkbox" label={text('label', "I'm a label")} />;
};

export const Checked: React.FC = () => {
  return <Checkbox name="checkbox" label="I'm a checked" checked={true} />;
};

export const Disabled: React.FC = () => {
  return <Checkbox name="checkbox" label="I'm a label" disabled={true} />;
};

export const DisabledChecked: React.FC = () => {
  return <Checkbox name="checkbox" label="I'm a label" disabled={true} checked={true} />;
};
