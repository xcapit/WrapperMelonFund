import styled from 'styled-components';
import { ExchangeAlt } from '@styled-icons/fa-solid/ExchangeAlt';

export const TokenSwapButtonIcon = styled(ExchangeAlt)`
  height: ${(props) => props.theme.spaceUnits.m};
  vertical-align: -0.15em;
`;

export interface TokenSwapButtonProps {
  disabled?: boolean;
}

export const TokenSwapButton = styled.div<TokenSwapButtonProps>`
  padding: ${(props) => props.theme.spaceUnits.xs} ${(props) => props.theme.spaceUnits.m};
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  border-color: ${(props) => props.theme.mainColors.secondaryDarkAlpha};
  border-style: solid;
  border-width: 0px 1px 0px 0px;
  background-color: ${(props) => (props.disabled ? props.theme.mainColors.secondary : props.theme.mainColors.primary)};
  height: ${(props) => props.theme.spaceUnits.xl};
`;
