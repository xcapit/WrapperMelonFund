import React from 'react';
import * as S from './Footer';

export default { title: 'Layouts|Footer' };

export const Default: React.FC = () => {
  return (
    <S.Footer>
      <S.FooterNavigation>
        <S.FooterItem>
          <a href="https://melonprotocol.com">exampleLink</a>
        </S.FooterItem>
        <S.FooterItem>
          <a href="https://melonprotocol.com">exampleLink</a>
        </S.FooterItem>
        <S.FooterItem>
          <a href="https://melonprotocol.com">exampleLink</a>
        </S.FooterItem>
        <S.FooterItem>
          <a href="https://melonprotocol.com">exampleLink</a>
        </S.FooterItem>
        <S.FooterItem>
          <a href="https://melonprotocol.com">exampleLink</a>
        </S.FooterItem>
      </S.FooterNavigation>
      <S.FooterItem>
        <span>Last price update at 23.03</span>
      </S.FooterItem>
    </S.Footer>
  );
};
