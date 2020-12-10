import React from 'react';
import { Logo } from '../Logo/Logo';
import * as S from './Header';

export default { title: 'Layouts|Header' };

export const Default: React.FC = () => {
  return (
    <S.Header>
      <S.HeaderContent>
        <S.LogoContainer>
          <Logo name="with-bottom-text" size="small" />
        </S.LogoContainer>
        <S.ConnectionInfo>
          <S.ConnectionInfoItem>Name</S.ConnectionInfoItem>
          <S.ConnectionInfoItem>link</S.ConnectionInfoItem>
          <S.ConnectionInfoItem>Live</S.ConnectionInfoItem>
          <S.ConnectionInfoItem>ETH 1.00000</S.ConnectionInfoItem>
          <S.ConnectionInfoItem>Ready</S.ConnectionInfoItem>
        </S.ConnectionInfo>
      </S.HeaderContent>
    </S.Header>
  );
};
