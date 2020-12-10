import React from 'react';
import { SpinIcon } from '~/storybook/SpinIcon/SpinIcon';
import * as S from './Button.styles';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'large' | 'small' | 'extrasmall';
  length?: 'stretch';
  kind?: 'secondary' | 'warning' | 'danger' | 'success';
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ loading, children, ...props }) => (
  <S.Button {...props}>
    {children}
    {loading && <SpinIcon />}
  </S.Button>
);
