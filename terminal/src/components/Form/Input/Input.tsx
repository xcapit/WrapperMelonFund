import React from 'react';
import { useField, Wrapper, Label, Error, GenericInputProps } from '~/components/Form/Form';
import * as S from './Input.styles';

export interface InputProps extends GenericInputProps<string> {
  name: string;
  label?: string;
  touched?: boolean;
  error?: string;
}

export const Input: React.FC<InputProps> = (props) => {
  const [field, meta] = useField({ type: 'text', ...props });
  if (props.type === 'hidden') {
    return <input {...field} {...props} />;
  }

  return <InputWidget {...meta} {...field} {...props} />;
};

export const InputWidget: React.FC<InputProps> = (props) => {
  const { label, ...rest } = props;

  return (
    <Wrapper>
      {label && <Label>{label}</Label>}
      <InputField {...rest} />
      {rest.touched && rest.error && <Error>{rest.error}</Error>}
    </Wrapper>
  );
};

export const InputField = S.Input;
