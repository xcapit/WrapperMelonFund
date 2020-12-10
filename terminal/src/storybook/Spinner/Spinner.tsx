import React from 'react';
import * as S from './Spinner.styles';

export interface SpinnerProps {
  positioning?: 'overlay' | 'centered';
  icon?: boolean;
  text?: string;
  size?: 'default' | 'tiny' | 'small' | 'large' | 'inflated';
}

export const Spinner: React.FC<SpinnerProps> = ({ icon = true, text = false, size = 'default', positioning }) => {
  return (
    <S.SpinnerPositioning positioning={positioning} size={size}>
      <S.Spinner size={size}>
        <S.Wrapper>
          {icon && <S.Logo name="without-border" />}
          <S.Loader />
        </S.Wrapper>
        {text && <S.Text>{text}</S.Text>}
      </S.Spinner>
    </S.SpinnerPositioning>
  );
};
