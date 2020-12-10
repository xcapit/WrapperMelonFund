import React from 'react';
import { useField, Error, Wrapper, Label, GenericInputProps } from '~/components/Form/Form';
import * as S from './RadioButtons.styles';

export interface RadioButtonProps extends GenericInputProps {
  name: string;
  label?: string;
}

export const RadioButton: React.FC<RadioButtonProps> = ({ label, ...rest }) => {
  const id = rest.id ?? `${rest.name}:${rest.value}`;

  return (
    <S.RadioButtonContainer>
      <S.RadioButtonInput type="radio" {...rest} id={id} />
      <S.RadioButtonMask>
        <S.RadioButtonIcon />
      </S.RadioButtonMask>
      {label && <S.RadioButtonLabel htmlFor={id}>{label}</S.RadioButtonLabel>}
    </S.RadioButtonContainer>
  );
};

export interface RadioButtonOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioButtonsProps extends RadioButtonProps {
  options: RadioButtonOption[];
}

export const RadioButtons: React.FC<RadioButtonsProps> = ({ options, ...props }) => {
  const [field, meta] = useField({ type: 'radio', ...props });
  const children = options.map((item) => {
    const key = `${item.label}:${item.value}`;
    const checked = meta.value === item.value;
    return <RadioButton key={key} {...meta} {...field} {...props} {...item} checked={checked} />;
  });

  return (
    <Wrapper>
      {props.label && <Label>{props.label}</Label>}
      {children}
      {meta.touched && meta.error && <Error>{meta.error}</Error>}
    </Wrapper>
  );
};
