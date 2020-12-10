import React from 'react';
import { useField, Wrapper, Error, GenericInputProps } from '~/components/Form/Form';
import { CheckboxIcon, CheckboxContainer, CheckboxInput, CheckboxMask, CheckboxLabel } from './Checkbox.styles';

export interface CheckboxProps extends GenericInputProps {
  name: string;
  label?: string;
  touched?: boolean;
  error?: string;
}

export const CheckboxItem: React.FC<CheckboxProps> = ({ label, ...rest }) => {
  const id = rest.id ?? rest.name;

  return (
    <CheckboxContainer>
      <CheckboxInput type="checkbox" {...rest} id={id} />

      <CheckboxMask>
        <CheckboxIcon />
      </CheckboxMask>

      {label && <CheckboxLabel htmlFor={id}>{label}</CheckboxLabel>}
      {rest.touched && rest.error && <Error>{rest.error}</Error>}
    </CheckboxContainer>
  );
};

export const Checkbox: React.FC<CheckboxProps> = (props) => {
  const [field, meta] = useField({ type: 'checkbox', ...props });

  return (
    <Wrapper>
      <CheckboxItem {...meta} {...field} {...props} />
    </Wrapper>
  );
};
