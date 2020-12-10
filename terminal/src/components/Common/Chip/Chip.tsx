import React from 'react';
import styled, { css } from 'styled-components';

export const ChipWrapper = styled.span`
  background: ${(props) => props.theme.otherColors.red};
  border-radius: 4px;
  font-size: ${(props) => props.theme.fontSizes.xxs};
  padding: ${(props) => props.theme.spaceUnits.xxs};
  margin-right: ${(props) => props.theme.spaceUnits.xxs};
  ${(props) => {
    if (props.color) {
      return css`
        background-color: ${props.color};
      `;
    } else {
      return css`
        background-color: ${(props) => props.theme.otherColors.red};
      `;
    }
  }};
`;

export interface ChipProps {
  color?: string;
}

export const Chip: React.FC<ChipProps> = (props) => {
  return <ChipWrapper {...props}>{props.children}</ChipWrapper>;
};
