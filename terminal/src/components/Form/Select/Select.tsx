import React from 'react';
import {
  ActionMeta,
  components,
  ControlProps,
  default as SelectBase,
  MultiValueProps,
  OptionProps,
  OptionsType,
  Props as SelectPropsBase,
  SingleValueProps,
  ValueType,
  IndicatorProps,
} from 'react-select';
import { MenuListComponentProps } from 'react-select/src/components/Menu';
import { Error, Label, useField, Wrapper } from '~/components/Form/Form';
import { IconName, Icons } from '~/storybook/Icons/Icons';
import * as S from './Select.styles';

export interface SelectOption<TValue = string | number> {
  value: TValue;
  label: string;
  description?: string;
  icon?: string | JSX.Element;
  [key: string]: any;
}

export interface SelectProps<TOption extends SelectOption = SelectOption> extends SelectPropsBase<TOption> {
  options: OptionsType<TOption>;
  name: string;
  label?: string | JSX.Element;
  Component?: React.ElementType<SelectPropsBase<TOption>>;
}

export const Select: React.FC<SelectProps> = (props) => {
  const [field, meta, { setValue }] = useField({ type: 'select', name: props.name });
  const value = React.useMemo(() => {
    if (props.isMulti) {
      return props.options?.filter((option) => field.value?.includes(option.value));
    }

    return props.options?.find((option: SelectOption) => option.value === field.value);
  }, [field.value, props.options, props.isMulti]);

  const onChange = React.useCallback(
    (option: ValueType<SelectOption>, action: ActionMeta<SelectOption>) => {
      const selection = props.isMulti
        ? ((option as any) as SelectOption[]).map((item) => item.value)
        : ((option as any) as SelectOption).value;

      setValue(selection);

      if (typeof props.onChange === 'function') {
        props.onChange(option, action);
      }
    },
    [setValue, props.isMulti, props.onChange]
  );

  return <SelectWidget {...meta} {...field} {...props} value={value} onChange={onChange} />;
};

export const SelectWidget: React.FC<SelectProps> = ({ label, ...props }) => {
  return (
    <Wrapper>
      {label && <Label>{label}</Label>}
      <SelectField {...props} />
      {props.touched && props.error && <Error>{props.error}</Error>}
    </Wrapper>
  );
};

export const SelectField: React.FC<SelectProps> = ({ Component = SelectBase, ...props }) => {
  const hasDescriptions = React.useMemo(() => {
    return props.options.some((option: any) => !!option.description);
  }, [props.options]);

  const hasIcons = React.useMemo(() => {
    return props.options.some((option: any) => !!option.icon);
  }, [props.options]);

  return (
    <Component
      {...props}
      theme={props.theme}
      isDisabled={props.disabled ?? props.isDisabled}
      components={{ Option, SingleValue, MultiValue, Control, MenuList, DropdownIndicator, ...props.components }}
      hasDescriptions={hasDescriptions}
      hasIcons={hasIcons}
      classNamePrefix="melon"
    />
  );
};

export interface SelectLabelProps {
  label: string;
  icon?: string | JSX.Element;
}

export const SelectLabel: React.FC<SelectLabelProps> = (props) => (
  <S.SelectWrapper>
    {props.icon ? (
      <S.SelectIcon>
        {typeof props.icon === 'string' ? <Icons name={props.icon as IconName} size="small" /> : <>{props.icon}</>}
      </S.SelectIcon>
    ) : null}
    <S.SelectLabel>
      {props.label}
      {props.label.length === 3 && <>&nbsp;</>}
    </S.SelectLabel>
  </S.SelectWrapper>
);

const Option: React.FC<OptionProps<SelectOption>> = (props) => {
  const hasDescriptions = !!props.selectProps.hasDescriptions;

  return (
    <S.ComponentsOption>
      <components.Option {...props}>
        <S.SelectWrapper>
          {props.data.icon ? (
            <S.SelectIcon>
              {typeof props.data.icon === 'string' ? (
                <Icons name={props.data.icon as IconName} size={hasDescriptions ? 'normal' : 'small'} />
              ) : (
                <>{props.data.icon}</>
              )}
            </S.SelectIcon>
          ) : null}

          {props.data.description ? (
            <S.SelecLabelWrapper>
              <S.SelectLabel>{props.data.label}</S.SelectLabel>
              <S.SelectDescription>{props.data.description}</S.SelectDescription>
            </S.SelecLabelWrapper>
          ) : (
            <S.SelectLabel>{props.data.label}</S.SelectLabel>
          )}
        </S.SelectWrapper>
      </components.Option>
    </S.ComponentsOption>
  );
};

const SingleValue: React.FC<SingleValueProps<SelectOption>> = (props) => (
  <S.ComponentsSingleValue>
    <components.SingleValue {...props}>
      <SelectLabel {...props.data} />
    </components.SingleValue>
  </S.ComponentsSingleValue>
);

const MultiValue: React.FC<MultiValueProps<SelectOption>> = (props) => (
  <S.ComponentsMultiValue>
    <components.MultiValue {...props}>
      <SelectLabel {...props.data} />
    </components.MultiValue>
  </S.ComponentsMultiValue>
);

const Control: React.FC<ControlProps<SelectOption>> = (props) => (
  <S.ComponentsControl>
    <components.Control {...props} />
  </S.ComponentsControl>
);

const MenuList: React.FC<MenuListComponentProps<SelectOption>> = (props) => (
  <S.ComponentsMenuList>
    <components.MenuList {...props} />
  </S.ComponentsMenuList>
);

const DropdownIndicator: React.FC<IndicatorProps<SelectOption>> = (props) => (
  <S.IndicatorContainer>
    <components.DropdownIndicator {...props} />
  </S.IndicatorContainer>
);
