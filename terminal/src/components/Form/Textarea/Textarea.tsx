import React from 'react';
import { useField, Wrapper, Label, Error, GenericTextareaProps } from '~/components/Form/Form';
import { TextareaInput } from './Textarea.styles';

export interface TextareaProps extends GenericTextareaProps {
  name: string;
  label?: string;
  touched?: boolean;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, ...props }) => {
  const [field, meta] = useField({ type: 'textarea', ...props });

  return (
    <Wrapper>
      {label && <Label>{label}</Label>}
      <TextareaInput cols={30} rows={5} {...meta} {...field} {...props} />
      {meta.touched && meta.error && <Error>{meta.error}</Error>}
    </Wrapper>
  );
};
