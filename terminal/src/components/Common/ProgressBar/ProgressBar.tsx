import React, { createContext } from 'react';
import { useSpring } from 'react-spring';

import { ProgressBarStepProps } from './ProgressBarStep/ProgressBarStep';
import * as S from '~/storybook/ProgressBar/ProgressBar';

export interface ProgressBarProps {
  step: number;
  loading: boolean;
}

export const ProgressBarContext = createContext({
  current: 0,
  loading: false,
});

export const ProgressBar: React.FC<ProgressBarProps> = ({ step, loading, children }) => {
  const childrenWithProps = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement<ProgressBarStepProps>(child, {
        ...child.props,
        step: index || 0,
      });
    }

    return null;
  });

  const percent = children && Array.isArray(children) && children.length ? (100 / (children.length - 1)) * step : 0;

  const transitions = useSpring({
    from: { width: '0%' },
    to: { width: `${percent}%` },
    config: { duration: 500 },
  });

  return (
    <S.Container>
      <S.BadgeContainer>
        <ProgressBarContext.Provider value={{ loading, current: step }}>
          {childrenWithProps}
        </ProgressBarContext.Provider>
      </S.BadgeContainer>
      <S.ProgressBar>
        <S.Progress style={transitions} />
      </S.ProgressBar>
    </S.Container>
  );
};
