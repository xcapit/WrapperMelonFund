import React, { useState } from 'react';
import { Manager, Reference, Popper } from 'react-popper';
import * as S from './Tooltip.styles';
import styled from 'styled-components';

export interface TooltipProps {
  value?: string | number | React.ReactNode;
  placement?:
    | 'right'
    | 'auto'
    | 'auto-start'
    | 'auto-end'
    | 'top'
    | 'bottom'
    | 'left'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'right-start'
    | 'right-end'
    | 'left-start'
    | 'left-end'
    | undefined;
}

export const Tooltip: React.FC<TooltipProps> = ({ value, placement, children }) => {
  const [position, setPosition] = useState(false);
  const tooltipPlacement = placement ? placement : 'right';
  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <span ref={ref} onMouseEnter={() => setPosition(true)} onMouseLeave={() => setPosition(false)}>
            {children}
          </span>
        )}
      </Reference>
      {position && (
        <Popper placement={tooltipPlacement}>
          {({ ref, style, placement }) => (
            <S.Container ref={ref} style={style} data-placement={placement}>
              {value}
            </S.Container>
          )}
        </Popper>
      )}
    </Manager>
  );
};
