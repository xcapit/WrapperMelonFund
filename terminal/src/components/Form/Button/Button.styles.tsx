import styled, { css } from 'styled-components';

export interface ButtonProps {
  kind?: 'secondary' | 'warning' | 'danger' | 'success' | 'invest';
  size?: 'large' | 'small' | 'extrasmall';
  length?: 'stretch';
  disabled?: boolean;
  loading?: boolean;
}

const ButtonBase = css`
  width: auto;
  height: ${(props) => props.theme.spaceUnits.xxl};
  padding: 0px ${(props) => props.theme.spaceUnits.m};
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: ${(props) => props.theme.border.borderRadius};
  white-space: nowrap;
  cursor: pointer;
  transition: ${(props) => props.theme.transition.defaultAll};

  a {
    text-decoration: none;
  }

  & + & {
    margin-left: ${(props) => props.theme.spaceUnits.m};
  }

  svg {
    margin-left: ${(props) => props.theme.spaceUnits.xs};
  }
`;

export const Button = styled.button<ButtonProps>`
  ${ButtonBase}
  color: ${(props) => props.theme.mainColors.primary};
  background: ${(props) => props.theme.mainColors.primaryDark};
  :hover{
    opacity: 0.75;
  }
  :active{
    background: ${(props) => props.theme.otherColors.white};
  }
  ${(props) =>
    props.kind === 'secondary' &&
    css`
      color: ${(props) => props.theme.mainColors.primaryDark};
      background: ${(props) => props.theme.mainColors.primary};
      border: ${(props) => props.theme.border.borderDefault};
      :hover {
        background: ${(props) => props.theme.mainColors.secondary};
      }
    `}
  ${(props) =>
    props.kind === 'warning' &&
    css`
      background: ${(props) => props.theme.statusColors.warning};
    `}
  ${(props) =>
    props.kind === 'danger' &&
    css`
      background: ${(props) => props.theme.otherColors.coral};
    `}
  ${(props) =>
    props.kind === 'success' &&
    css`
      background: ${(props) => props.theme.otherColors.turquoise};
    `}

  ${(props) =>
    props.disabled &&
    css`
      background: ${(props) => props.theme.mainColors.secondaryDarkAlpha};
      pointer-events: none;
    `}
  ${(props) =>
    props.size === 'large' &&
    css`
      height: 48px;
    `}
  ${(props) =>
    props.size === 'small' &&
    css`
      height: 32px;
      padding: 0px ${(props) => props.theme.spaceUnits.s};
      & + & {
        margin-left: ${(props) => props.theme.spaceUnits.s};
      }
    `}
    ${(props) =>
      props.size === 'extrasmall' &&
      css`
        height: 24px;
        padding: 0px ${(props) => props.theme.spaceUnits.xs};
        & + & {
          margin-left: ${(props) => props.theme.spaceUnits.xs};
        }
      `}
    ${(props) =>
      props.length === 'stretch' &&
      css`
        width: 100%;
      `}
`;

export const LinkButton = styled(Button).attrs({
  as: 'a',
})<React.AnchorHTMLAttributes<HTMLAnchorElement>>`
  text-decoration: none;
`;
