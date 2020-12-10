import React from 'react';
import { TokenDefinition, sameAddress } from '@melonproject/melonjs';
import {
  TokenValueSelectField,
  TokenSelectOption,
  TokenSelectTrigger,
  TokenSelectInput,
  TokenValueSelectPreset,
} from '../TokenValueSelect/TokenValueSelect';
import { TokenValue } from '~/TokenValue';
import { useField } from 'formik';
import { SelectOption } from '../Select/Select';
import { Error, Wrapper, Label } from '../Form';
import { useClickOutside } from '~/hooks/useClickOutside';
import { ValueType } from 'react-select';
import * as S from './TokenSwap.styles';

export interface TokenSwapProps {
  baseName: string;
  quoteName: string;
  baseTokens: TokenDefinition[];
  quoteTokens: TokenDefinition[];
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  presets?: TokenValueSelectPreset[];
  onChange?: (
    after: { base?: TokenValue; quote?: TokenDefinition },
    before: { base?: TokenValue; quote?: TokenDefinition }
  ) => void;
}

export interface TokenSwapOptions extends SelectOption {
  value: string;
}

export const TokenSwap: React.FC<TokenSwapProps> = ({
  baseName,
  quoteName,
  baseTokens,
  quoteTokens,
  label,
  placeholder,
  disabled,
  presets,
  onChange,
}) => {
  const [{ onChange: _, ...fieldBase }, metaBase, helpersBase] = useField<TokenValue | undefined>(baseName);
  const [{ onChange: __, ...fieldQuote }, metaQuote, helpersQuote] = useField<TokenDefinition | undefined>(quoteName);

  const touched = metaBase.touched || metaQuote.touched;
  const error = metaBase.error || metaQuote.error;

  const inputRef = React.useRef<any>();
  const selectRef = React.useRef<any>();
  const triggerRef = React.useRef<any>();
  const [open, setOpen] = React.useState(false);

  const handleClickOutside = React.useCallback(() => open && setOpen(false), [open, setOpen]);
  useClickOutside([selectRef, triggerRef], handleClickOutside);

  const handleBaseTokenChange = React.useCallback(
    ($after: TokenValue, $before?: TokenValue) => {
      const before = {
        base: $before,
        quote: fieldQuote.value,
      };

      const after = {
        base: $after,
        quote: fieldQuote.value,
      };

      onChange?.(after, before);
    },
    [onChange]
  );

  const handleQuoteTokenChange = React.useCallback(
    (option: ValueType<SelectOption>) => {
      if (Array.isArray(option)) {
        return;
      }

      const before = {
        base: fieldBase.value,
        quote: fieldQuote.value,
      };

      const after = {
        base: fieldBase.value,
        quote: (option as TokenSelectOption).token,
      };

      setOpen(false);
      helpersQuote.setValue(after.quote);
      helpersQuote.setTouched(true);
      onChange?.(after, before);

      // Focus the big number input field after selecting a token.
      setTimeout(() => {
        inputRef.current?.focus();
      });
    },
    [fieldQuote.value, fieldBase.value, helpersQuote.setValue, setOpen, onChange]
  );

  const quoteSwitch = React.useMemo(() => {
    if (!fieldBase.value) {
      return undefined;
    }

    return quoteTokens.find((item) => sameAddress(fieldBase.value!.token.address, item.address));
  }, [quoteTokens, fieldBase.value]);

  const baseSwitch = React.useMemo(() => {
    if (!fieldQuote.value) {
      return undefined;
    }

    return baseTokens.find((item) => sameAddress(fieldQuote.value!.address, item.address));
  }, [baseTokens, fieldQuote.value]);

  const handleTokenSwap = React.useCallback(() => {
    if (!(baseSwitch && quoteSwitch && fieldBase.value)) {
      return;
    }

    helpersQuote.setValue(quoteSwitch);
    helpersBase.setValue(fieldBase.value!.setToken(baseSwitch));
  }, [baseSwitch, quoteSwitch, fieldBase.value, helpersBase.setValue, helpersQuote.setValue]);

  return (
    <Wrapper>
      <Label>{label}</Label>

      <TokenValueSelectField
        {...helpersBase}
        {...metaBase}
        {...fieldBase}
        name={baseName}
        disabled={disabled}
        tokens={baseTokens}
        placeholder={placeholder}
        inputRef={inputRef}
        presets={presets}
        onChange={handleBaseTokenChange}
      >
        <S.TokenSwapButton disabled={!(quoteSwitch && baseSwitch)} onClick={handleTokenSwap}>
          <S.TokenSwapButtonIcon />
        </S.TokenSwapButton>

        <TokenSelectTrigger
          triggerRef={triggerRef}
          token={fieldQuote.value}
          disabled={disabled}
          open={open}
          toggle={setOpen}
        />
      </TokenValueSelectField>

      <TokenSelectInput
        name={quoteName}
        tokens={quoteTokens}
        disabled={disabled}
        selected={fieldQuote.value}
        open={open}
        onChange={handleQuoteTokenChange}
        selectRef={selectRef}
      />

      {touched && error && <Error>{error}</Error>}
    </Wrapper>
  );
};
