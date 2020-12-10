import React from 'react';
import * as S from './Pagination.styles';

export interface PaginationProps {
  hasPrevious: boolean;
  hasNext: boolean;
  previous: () => void;
  next: () => void;
  first: () => void;
  last: () => void;
  goTo: (page: number) => void;
  actual: number;
  totalItems: number;
  itemsPerPage?: number;
  position?: 'center' | 'flex-start' | 'flex-end';
}

export const Pagination: React.FC<PaginationProps> = ({
  hasPrevious = false,
  hasNext = false,
  previous = () => {},
  next = () => {},
  first = () => {},
  last = () => {},
  goTo = () => {},
  actual = 0,
  totalItems = 0,
  itemsPerPage = 15,
  position = 'center',
}) => {
  const pages = Math.ceil(totalItems / itemsPerPage);

  if (pages <= 0) return <></>;

  return (
    <S.Container position={position}>
      {!hasPrevious && (
        <>
          <S.Li onClick={first}>{'<<'}</S.Li>
          <S.Li onClick={previous}>{'<'}</S.Li>
        </>
      )}

      {Array(pages)
        .fill('')
        .map((_, i) => (
          <S.Li key={i} onClick={() => goTo(i)} selected={actual === i + 1}>
            {i + 1}
          </S.Li>
        ))}

      {!hasNext && (
        <>
          <S.Li onClick={next}>{'>'}</S.Li>
          <S.Li onClick={last}>{'>>'}</S.Li>
        </>
      )}
    </S.Container>
  );
};
