import React, { useContext } from 'react';

import { ProgressBarContext } from '../ProgressBar';
import * as S from '~/storybook/ProgressBarStep/ProgressBarStep';

export interface ProgressBarStepProps {
  step?: number;
}

export const ProgressBarStep: React.FC<ProgressBarStepProps> = ({ step = 0 }) => {
  const { current, loading } = useContext(ProgressBarContext);

  const isSelected = step === 0 ? true : current >= step;
  const isLoading = current === step - 1;

  return (
    <S.Badge selected={isSelected}>
      {loading && isLoading && <S.BadgeLoader />}
      <S.BadgeIndex />
    </S.Badge>
  );
};
