import React from 'react';
import { text } from '@storybook/addon-knobs';
import { withForm } from '~/components/Form/Form.decorator';
import { Input } from './Input';

export default {
  title: 'Forms|Input',
  decorators: [withForm()],
};

export const Default = () => <Input name="input" label={text('label', "I'm a label")} />;

export const Disabled = () => <Input name="input" disabled={true} />;

export const Placeholder = () => <Input name="input" placeholder="Custom placeholder" />;
