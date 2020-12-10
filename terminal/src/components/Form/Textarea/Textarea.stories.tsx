import React from 'react';
import { text } from '@storybook/addon-knobs';
import { withForm } from '~/components/Form/Form.decorator';
import { Textarea } from './Textarea';

export default {
  title: 'Forms|Textarea',
  decorators: [withForm()],
};

export const Default = () => <Textarea name="textarea" label={text('label', 'I m a label')} />;

export const Disabled = () => <Textarea name="textarea" disabled={true} />;

export const Placeholder = () => <Textarea name="textarea" placeholder="Custom placeholder" />;
