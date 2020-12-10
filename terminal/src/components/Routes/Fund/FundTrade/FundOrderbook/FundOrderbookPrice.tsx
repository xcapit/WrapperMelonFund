import React from 'react';
import BigNumber from 'bignumber.js';
import * as S from './FundOrderbook.styles';

export interface FundOrderbookPriceProps {
  price: BigNumber;
  decimals?: number;
  change?: number;
}

export const FundOrderbookPrice: React.FC<FundOrderbookPriceProps> = (props) => {
  const decimals = props.decimals ?? 8;
  const changedDigits = props.change !== undefined ? props.price.toFixed(decimals).slice(props.change) : undefined;
  const unchangedDigits =
    changedDigits === undefined
      ? props.price.toFixed(decimals)
      : props.price.toFixed(decimals).slice(0, props.change ?? props.price.toFixed(decimals).length - 1);

  return (
    <S.OrderbookPrice>
      {unchangedDigits}
      <S.OrderbookHighlight>{changedDigits}</S.OrderbookHighlight>
    </S.OrderbookPrice>
  );
};
