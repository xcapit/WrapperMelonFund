import styled, { css } from 'styled-components';
import { Button } from '~/components/Form/Button/Button';

export const ControlBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  @media (${(props) => props.theme.mediaQueries.s}) {
    display: flex;
    justify-content: left;
  }
`;

export const ChartButton = styled(Button)`
  font-size: ${(props) => props.theme.spaceUnits.s};
  text-align: center;
  width: auto;
  height: auto;
  padding: ${(props) => props.theme.spaceUnits.xxs};
  border: ${(props) => props.theme.border.borderColor};
  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.5;
      background: none;
    `}
`;
