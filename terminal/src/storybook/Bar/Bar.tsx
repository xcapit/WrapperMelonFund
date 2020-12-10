import styled, { css } from 'styled-components';
import { Container } from '../Container/Container';

export interface BarContentProps {
  justify?: 'between' | 'around' | 'end';
}

export const Bar = styled.div`
  width: 100%;
  padding: ${(props) => props.theme.spaceUnits.l} 0px;
  border-bottom: ${(props) => props.theme.border.borderDefault};
  background-color: ${(props) => props.theme.mainColors.primary};
`;

export const BarContent = styled(Container)<BarContentProps>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  @media (${(props) => props.theme.mediaQueries.m}) {
    flex-wrap:nowrap;
  }
  ${(props) =>
    props.justify === 'between' &&
    css`
      justify-content: space-between;
    `}
  ${(props) =>
    props.justify === 'around' &&
    css`
      justify-content: space-around;
    `}
  ${(props) =>
    props.justify === 'end' &&
    css`
      justify-content: flex-end;
    `}

`;
