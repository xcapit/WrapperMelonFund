import styled from 'styled-components';
import { Container, Row, Col } from 'react-awesome-styled-grid';
import { Block } from '../Block/Block';

export interface GridProps {
  noGap?: boolean;
}

export const Grid = styled(Container)<GridProps>`
  width: 100%;
  ${(props) => !props.noGap && `margin: ${props.theme.spaceUnits.l} auto;`}
`;

export interface GridRowProps {
  noGap?: boolean;
}

export const GridRow = styled(Row)<GridRowProps>`
  ${(props) =>
    !props.noGap &&
    `
    :not(:last-child) {
      margin-bottom: ${props.theme.spaceUnits.s}
    }
  `};
`;

export const GridCol = styled(Col)`
  margin-bottom: ${(props) => props.theme.spaceUnits.xs};

  & > ${Block} {
    height: 100%;
  }
`;
