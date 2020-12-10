import React from 'react';
import * as S from './DataBlock.styles';

export interface DataBlockProps {
  label: React.ReactNode;
}

export const DataBlock: React.FC<DataBlockProps> = (props) => {
  return (
    <S.DataBlock>
      <S.DataLabel>{props.label}</S.DataLabel>
      <S.Data>{props.children}</S.Data>
    </S.DataBlock>
  );
};

export const DataBlockSection: React.FC = (props) => {
  return <S.DataBlockSection>{props.children}</S.DataBlockSection>;
};
