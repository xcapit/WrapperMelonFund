import React from 'react';
import { useDarkMode } from '~/components/Theme';
import { Icons } from '~/storybook/Icons/Icons';
import * as S from './DarkModeSwitch.styles';

export const DarkModeSwitch: React.FC = () => {
  const [dark, setDark] = useDarkMode();

  if (dark) {
    return (
      <S.ButtonNight onClick={() => setDark(!dark)}>
        <Icons name="SUN" size="small" />
      </S.ButtonNight>
    );
  }

  return (
    <S.ButtonDay onClick={() => setDark(!dark)}>
      <Icons name="MOON" size="small" />
    </S.ButtonDay>
  );
};
