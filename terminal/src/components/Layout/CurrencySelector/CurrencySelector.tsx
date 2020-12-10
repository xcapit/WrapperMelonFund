import React from 'react';
import { useCurrency } from '~/hooks/useCurrency';
import { SelectField } from '~/components/Form/Select/Select';
import * as S from './CurrencySelector.styles';

export const CurrencySelector: React.FC = () => {
  const currency = useCurrency();

  const options = currency.list.map((item) => {
    return { value: item.symbol, label: item.symbol };
  });

  return (
    <S.CurrencySelect>
      <SelectField
        name="currency"
        defaultValue={{ value: 'USD', label: 'USD' }}
        options={options}
        onChange={(event) => currency.switch((event as any).value)}
        isSearchable={false}
      />
    </S.CurrencySelect>
  );
};

export default CurrencySelector;
