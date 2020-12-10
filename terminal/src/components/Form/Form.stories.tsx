import React from 'react';
import * as Yup from 'yup';
import BigNumber from 'bignumber.js';
import { TokenDefinition } from '@melonproject/melonjs';
import { Input } from '~/components/Form/Input/Input';
import { Textarea } from '~/components/Form/Textarea/Textarea';
import { Button } from '~/components/Form/Button/Button';
import { Checkbox } from '~/components/Form/Checkbox/Checkbox';
import { CheckboxGroup } from '~/components/Form/CheckboxGroup/CheckboxGroup';
import { useFormik, Form } from './Form';
import { Select } from './Select/Select';
import { BigNumberInput } from './BigNumberInput/BigNumberInput';
import { RadioButtons } from './RadioButtons/RadioButtons';
import { TokenValue } from '~/TokenValue';
import { TokenValueSelect } from './TokenValueSelect/TokenValueSelect';
import { TokenValueInput } from './TokenValueInput/TokenValueInput';

export default { title: 'Forms|Form' };

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

const tokens = [
  {
    address: '0x0000000000000000000000000000000000000001',
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
  },
  {
    address: '0x0000000000000000000000000000000000000002',
    symbol: 'MLN',
    name: 'Melon',
    decimals: 18,
  },
  {
    address: '0x0000000000000000000000000000000000000003',
    symbol: 'SAI',
    name: 'Sai',
    decimals: 9,
  },
] as TokenDefinition[];

const validationSchema = Yup.object({
  input: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
  noLabel: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
  textarea: Yup.string().required().max(20, 'Must be 20 characters or less').required('Required'),
  checkboxes: Yup.array().min(1).max(2).required(),
  bigNumber: Yup.mixed()
    .required()
    .test('is-big-number', 'Has to be a big number', (value?: BigNumber) => {
      if (!value) {
        return false;
      }

      return BigNumber.isBigNumber(value);
    })
    .test('greater-or-equal', 'Must be bigger than 100', (value?: BigNumber) => {
      if (!value) {
        return false;
      }

      return value.isGreaterThanOrEqualTo(100);
    }),
  tokenValue: Yup.mixed()
    .required()
    .test('has-enough-decimals', 'Must have at the full decimal amount.', (value?: TokenValue) => {
      if (!value) {
        return false;
      }

      const decimals = value.value?.decimalPlaces();
      return !!decimals && new BigNumber(value.token.decimals).isEqualTo(decimals);
    }),
  tokenValueInput: Yup.mixed()
    .required()
    .test('has-enough-decimals', 'Must have at the full decimal amount.', (value?: TokenValue) => {
      if (!value) {
        return false;
      }

      const decimals = value.value?.decimalPlaces();
      return !!decimals && new BigNumber(value.token.decimals).isEqualTo(decimals);
    }),
});

const initialValues = {
  input: 'Hello',
  noLabel: 'No Label',
  textarea: 'Foo',
  checkbox: false,
  checkboxes: ['chocolate'],
  bigNumber: new BigNumber(123.456789),
};

export const Basic = () => {
  const formik = useFormik({
    validationSchema,
    initialValues,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <Form formik={formik}>
      <Input name="input" label="Input" />
      <Input name="noLabel" />
      <Textarea name="textarea" label="Textarea" />
      <Checkbox name="checkbox" label="Checkbox" />
      <CheckboxGroup name="checkboxes" label="Checkbox group" options={options} />
      <Select name="select" options={options} label="Select" />
      <Select name="selectMultiple" options={options} label="Select multiple" isMulti={true} />
      <BigNumberInput name="bigNumber" label="BigNumber" />
      <RadioButtons label="Radio Button" name="radioGroup" options={options} />
      <TokenValueSelect label="Token value Select" name="tokenValue" tokens={tokens} />
      <TokenValueInput label="Token value Input" name="tokenValueInput" />
      <Button type="submit">Submit</Button>
    </Form>
  );
};
