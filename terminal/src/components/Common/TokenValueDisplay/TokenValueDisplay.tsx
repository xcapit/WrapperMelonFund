import React from 'react';
import BigNumber from 'bignumber.js';
import { TokenValue } from '~/TokenValue';
import { FormattedNumber } from '../FormattedNumber/FormattedNumber';

export interface TokenValueDisplayProps {
  value?: BigNumber.Value | TokenValue;
  symbol?: string;
  decimals?: number;
  digits?: number;
  tooltipDigits?: number;
  prefixSymbol?: boolean;
}

export const TokenValueDisplay: React.FC<TokenValueDisplayProps> = ({
  value,
  symbol = '',
  prefixSymbol = false,
  decimals = 18,
  digits = 4,
  tooltipDigits = 18,
}) => {
  if (value instanceof TokenValue) {
    return (
      <FormattedNumber
        tooltip={true}
        value={value.value}
        suffix={!prefixSymbol ? value.token.symbol : ''}
        prefix={prefixSymbol ? value.token.symbol : ''}
        decimals={digits}
        tooltipDecimals={tooltipDigits}
      />
    );
  }

  const bn = BigNumber.isBigNumber(value) ? value : new BigNumber(value ?? 'NaN');
  return (
    <FormattedNumber
      tooltip={true}
      value={bn.dividedBy(new BigNumber(10).exponentiatedBy(decimals))}
      suffix={!prefixSymbol ? symbol : ''}
      prefix={prefixSymbol ? symbol : ''}
      decimals={digits}
      tooltipDecimals={tooltipDigits}
    />
  );
};
