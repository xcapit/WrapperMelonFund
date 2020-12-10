import React from 'react';
import BigNumber from 'bignumber.js';
import { TokenDefinition, sameAddress } from '@melonproject/melonjs';
import { ValueType, components } from 'react-select';
import { NumberFormatValues } from 'react-number-format';
import { BigNumberInputField } from '~/components/Form/BigNumberInput/BigNumberInput';
import { SelectField, SelectOption, SelectLabel, SelectProps } from '~/components/Form/Select/Select';
import { useField, Wrapper, Error, Label, FormikFieldProps } from '~/components/Form/Form';
import { TokenValue } from '~/TokenValue';
import { useClickOutside } from '~/hooks/useClickOutside';
import * as S from './TokenValueSelect.styles';
import { Button } from '~/components/Form/Button/Button';

export interface TokenValueSelectPreset {
  label: string;
  value: TokenValue;
  disabled?: boolean;
}

export interface TokenValueSelectProps {
  name: string;
  label?: string | JSX.Element;
  tokens: TokenDefinition[];
  disabled?: boolean;
  presets?: TokenValueSelectPreset[];
  placeholder?: string;
  onChange?: (after: TokenValue, before?: TokenValue) => void;
}

export interface TokenSelectOption extends SelectOption<string> {
  token: TokenDefinition;
}

export const TokenValueSelect: React.FC<TokenValueSelectProps> = ({ label, ...props }) => {
  const [{ onChange: onChangeInternal, ...field }, meta, helpers] = useField<TokenValue | undefined>(props.name);

  return (
    <Wrapper>
      <Label>{label}</Label>
      <TokenValueSelectField {...helpers} {...meta} {...field} {...props} />
      {meta.touched && meta.error && <Error>{meta.error}</Error>}
    </Wrapper>
  );
};

type TokenValueSelectFieldBaseProps = TokenValueSelectProps &
  Omit<FormikFieldProps<TokenValue | undefined>, 'onChange'>;

export interface TokenValueSelectFieldProps extends TokenValueSelectFieldBaseProps {
  tokens: TokenDefinition[];
  inputRef?: React.MutableRefObject<any>;
}

export const TokenValueSelectField: React.FC<TokenValueSelectFieldProps> = ({
  children,
  value,
  setValue,
  setTouched,
  setError,
  onChange,
  presets,
  inputRef: providedInputRef,
  ...props
}) => {
  const inputRef = providedInputRef ?? React.useRef<any>();
  const selectRef = React.useRef<any>();
  const triggerRef = React.useRef<any>();
  const [open, setOpen] = React.useState(false);

  const handleClickOutside = React.useCallback(() => open && setOpen(false), [open, setOpen]);
  useClickOutside([selectRef, triggerRef], handleClickOutside);

  React.useEffect(() => {
    if (open && props.disabled) {
      setOpen(false);
    }
  }, [props.disabled, open, setOpen]);

  const number = React.useMemo(() => {
    if (!value) {
      return;
    }

    const number = value.value;
    return (BigNumber.isBigNumber(number) ? number.toFixed() : number) as string;
  }, [value]);

  const handleTokenChange = React.useCallback(
    (option: ValueType<SelectOption>) => {
      if (Array.isArray(option)) {
        return;
      }

      const before = value;
      const after = new TokenValue((option as SelectOption).token, value?.value);

      setOpen(false);
      setValue(after);
      setTouched(true);
      onChange?.(after, before);

      // Focus the big number input field after selecting a token.
      setTimeout(() => {
        inputRef.current?.focus();
      });
    },
    [value, setValue, onChange, setOpen]
  );

  const isAllowed = React.useCallback(() => !!value, [value]);

  const handleNumberChange = React.useCallback(
    (values: NumberFormatValues) => {
      if (!value) {
        return;
      }

      const before = value;
      const after = value!.setValue(values.value);
      if (before?.value?.comparedTo(after.value ?? '') === 0) {
        return;
      }

      setValue(after);
      onChange?.(after, before);
    },
    [value, setValue, onChange]
  );

  return (
    <>
      <S.InputContainer>
        <S.NumberInputWrapper>
          {!!presets?.length && (
            <S.InputPresetWrapper>
              {presets.map((preset) => (
                <Button
                  type="button"
                  size="extrasmall"
                  disabled={preset.disabled}
                  onClick={() => {
                    setValue(preset.value);
                    onChange?.(preset.value, value);
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </S.InputPresetWrapper>
          )}

          <BigNumberInputField
            {...props}
            getInputRef={inputRef}
            value={number}
            decimalScale={value?.token.decimals}
            onValueChange={handleNumberChange}
            isAllowed={isAllowed}
            disabled={!value || props.disabled}
            placeholder={value ? (props.placeholder ? props.placeholder : 'Enter a value ...') : undefined}
          />
        </S.NumberInputWrapper>

        <TokenSelectTrigger
          triggerRef={triggerRef}
          disabled={props.disabled}
          token={value?.token}
          open={open}
          toggle={setOpen}
        />

        {children}
      </S.InputContainer>

      <TokenSelectInput
        selectRef={selectRef}
        name={`${props.name}Token`}
        tokens={props.tokens}
        selected={value?.token}
        open={open}
        onChange={handleTokenChange}
      />
    </>
  );
};

export interface TokenSelectTriggerProps {
  triggerRef: React.MutableRefObject<any>;
  token?: TokenDefinition;
  disabled?: boolean;
  open?: boolean;
  toggle: (open: boolean) => void;
}

export const TokenSelectTrigger: React.FC<TokenSelectTriggerProps> = (props) => {
  const handleClick = React.useCallback(() => !props.disabled && props.toggle(!props.open), [
    props.open,
    props.disabled,
  ]);

  return (
    <S.SelectTrigger disabled={props.disabled} ref={props.triggerRef} onClick={handleClick}>
      {props.token ? <SelectLabel icon={props.token.symbol} label={props.token.symbol} /> : 'Select a token ...'}{' '}
      <S.Dropdown>
        <components.DownChevron />
      </S.Dropdown>
    </S.SelectTrigger>
  );
};

export interface TokenSelectInputProps extends Omit<Omit<SelectProps<TokenSelectOption>, 'options'>, 'value'> {
  name: string;
  tokens: TokenDefinition[];
  open?: boolean;
  selected?: TokenDefinition;
  disabled?: boolean;
  selectRef: React.MutableRefObject<any>;
}

export const TokenSelectInput: React.FC<TokenSelectInputProps> = ({
  selectRef,
  open,
  disabled,
  selected,
  ...props
}) => {
  const options = React.useMemo<TokenSelectOption[]>(() => {
    return props.tokens.map((item) => ({
      value: item.address,
      label: item.symbol,
      description: item.name,
      icon: item.symbol,
      token: item,
    }));
  }, [props.tokens]);

  const selection = React.useMemo(() => {
    return options.find((option) => sameAddress(option.value, selected?.address));
  }, [options, selected]);

  if (!open) {
    return null;
  }

  return (
    <S.SelectField ref={selectRef}>
      <SelectField
        autoFocus={true}
        backspaceRemovesValue={false}
        controlShouldRenderValue={false}
        hideSelectedOptions={false}
        isClearable={false}
        isSearchable={true}
        menuIsOpen={true}
        tabSelectsValue={false}
        components={{ IndicatorSeparator: null }}
        placeholder="Search ..."
        {...props}
        options={options}
        value={selection}
      />
    </S.SelectField>
  );
};
