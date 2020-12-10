import React from 'react';
import { select, boolean } from '@storybook/addon-knobs';
import { Button } from './Button';

export default {
  title: 'Forms|Button',
};

export const Default = () => (
  <Button
    size={select(
      'Size',
      {
        undefined,
        Large: 'large',
        Small: 'small',
      },
      undefined
    )}
    length={select(
      'length',
      {
        undefined,
        stretch: 'stretch',
      },
      undefined
    )}
    kind={select(
      'kind',
      {
        undefined,
        secondary: 'secondary',
        warning: 'warning',
        danger: 'danger',
        success: 'success',
      },
      undefined
    )}
    disabled={boolean('disabled', false)}
  >
    Default Button
  </Button>
);

export const Large = () => <Button size="large">Large Button</Button>;

export const Small = () => <Button size="small">Small Button</Button>;

export const Stretch = () => <Button length="stretch">Stretch Button</Button>;

export const Secondary = () => <Button kind="secondary">Secondary Button</Button>;

export const Warning = () => <Button kind="warning">Warning Button</Button>;

export const Danger = () => <Button kind="danger">Danger Button</Button>;

export const Success = () => <Button kind="success">Success Button</Button>;

export const Disabled = () => <Button disabled={true}>Disabled Button</Button>;

export const Loading = () => <Button loading={true}>Loading Button</Button>;
