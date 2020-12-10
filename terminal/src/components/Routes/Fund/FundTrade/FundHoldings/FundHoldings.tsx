import React from 'react';
import { Spinner } from '~/storybook/Spinner/Spinner';
import { useFundHoldingsQuery } from './FundHoldings.query';
import * as S from './FundHoldings.styles';
import { SectionTitle } from '~/storybook/Title/Title';
import { Block } from '~/storybook/Block/Block';
import { TokenValueDisplay } from '~/components/Common/TokenValueDisplay/TokenValueDisplay';

export interface FundHoldingsProps {
  address: string;
}

export const FundHoldings: React.FC<FundHoldingsProps> = ({ address }) => {
  const [holdings, query] = useFundHoldingsQuery(address);

  const nonZeroHoldings = holdings.filter((holding) => !holding.amount?.isZero());

  if (query.loading) {
    return (
      <Block>
        <SectionTitle>Portfolio Holdings</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  if (!nonZeroHoldings.length) {
    return (
      <Block>
        <SectionTitle>Portfolio Holdings</SectionTitle>
        No current holdings.
      </Block>
    );
  }

  return (
    <Block>
      <SectionTitle>Portfolio Holdings</SectionTitle>
      {nonZeroHoldings.map((holding, key) => (
        <S.Balance key={key}>
          <TokenValueDisplay
            value={holding.amount}
            decimals={holding.token!.decimals!}
            symbol={holding.token?.symbol}
          />
        </S.Balance>
      ))}
    </Block>
  );
};
