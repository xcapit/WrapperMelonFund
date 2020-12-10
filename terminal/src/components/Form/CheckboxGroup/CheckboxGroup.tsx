import React, { ChangeEvent } from 'react';
import { FieldArray, useField, getIn, Wrapper, Label, Error } from '~/components/Form/Form';
import { CheckboxItem, CheckboxProps } from '~/components/Form/Checkbox/Checkbox';

export interface CheckboxGroupOption {
  value: string;
  label?: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps extends CheckboxProps {
  options: CheckboxGroupOption[];
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = (props) => {
  const [field, meta] = useField({ type: 'checkbox', ...props });
  const mapping = React.useMemo(() => {
    if (Array.isArray(field.value)) {
      return field.value.reduce<{ [key: number]: number }>((carry, current, index) => {
        const key = props.options.findIndex((inner) => inner.value === current);
        return key !== -1 ? { ...carry, [key]: index } : carry;
      }, {});
    }

    return {} as { [key: number]: number };
  }, [field.value, props.options]);

  return (
    <Wrapper>
      {props.label && <Label>{props.label}</Label>}

      <FieldArray name={field.name}>
        {(array) => {
          const handle = (event: ChangeEvent<HTMLInputElement>) => {
            if (field.value.includes(event.target.value)) {
              array.remove(field.value.indexOf(event.target.value));
            } else {
              array.push(event.target.value);
            }
          };

          return props.options.map((item, index) => {
            const key = `${item.label}:${item.value}`;
            const name = `${array.name}.${index}`;

            const checked = field.value.includes(item.value);
            const error =
              Array.isArray(array.form.errors[array.name]) && mapping[index] != null
                ? getIn(array.form.errors[array.name], `${mapping[index]}`)
                : undefined;

            const touched =
              Array.isArray(array.form.touched[array.name]) && mapping[index] != null
                ? getIn(array.form.touched[array.name], `${mapping[index]}`)
                : undefined;

            return (
              <CheckboxItem
                key={key}
                {...meta}
                {...field}
                {...props}
                {...item}
                name={name}
                checked={checked}
                error={error}
                touched={touched}
                onChange={handle}
              />
            );
          });
        }}
      </FieldArray>

      {typeof meta.error === 'string' && meta.touched && <Error>{meta.error}</Error>}
    </Wrapper>
  );
};
