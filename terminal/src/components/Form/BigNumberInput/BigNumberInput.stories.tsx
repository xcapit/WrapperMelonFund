import React from 'react';
import { text } from '@storybook/addon-knobs';
import { withForm } from '~/components/Form/Form.decorator';
import { BigNumberInput } from './BigNumberInput';

export default {
  title: 'Forms|BigNumberInput',
  decorators: [withForm()],
};

export const Default = () => <BigNumberInput name="input" label={text('label', "I'm a label")} />;
