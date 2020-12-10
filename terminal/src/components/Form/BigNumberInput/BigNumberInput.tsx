import React from 'react';
import BigNumber from 'bignumber.js';
import NumberFormat, { NumberFormatValues, NumberFormatProps } from 'react-number-format';
import { InputWidget, InputField } from '~/components/Form/Input/Input';
import { useField, Wrapper, Label, Error } from '~/components/Form/Form';

export type BigNumberInputProps = Omit<NumberFormatProps, 'value'> & {
  name: string;
  value?: BigNumber.Value;
  label?: string | JSX.Element;
};

export const BigNumberInput: React.FC<BigNumberInputProps> = ({ label, ...props }) => {
  const [{ onChange, ...field }, meta, { setValue }] = useField<BigNumber.Value | undefined>({
    type: 'text',
    ...props,
  } as any);

  const onValueChange = React.useCallback(
    (values: NumberFormatValues) => {
      const value = new BigNumber(values.value);
      setValue(!value.isNaN() ? value : undefined);
    },
    [setValue]
  );

  return (
    <Wrapper>
      {label && <Label>{label}</Label>}
      <BigNumberInputField onValueChange={onValueChange} {...meta} {...field} {...props} />
      {meta.touched && meta.error && <Error>{meta.error}</Error>}
    </Wrapper>
  );
};

export const BigNumberInputField: React.FC<BigNumberInputProps> = (props) => {
  const value = (BigNumber.isBigNumber(props.value) ? props.value.toFixed() : props.value) as string;

  return (
    <NumberFormat
      customInput={InputField}
      thousandSeparator=","
      allowedDecimalSeparators={['.', ',']}
      {...props}
      value={value}
    />
  );
};
