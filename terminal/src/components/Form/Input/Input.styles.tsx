import styled, { css } from 'styled-components';
import { InputProps } from './Input';

export const Input = styled.input<InputProps>`
  position: relative;
  width: 100%;
  padding: 0px ${(props) => props.theme.spaceUnits.m};
  border: 1px solid ${(props) => props.theme.mainColors.secondaryDarkAlpha};
  border-radius: 0;
  background: ${(props) => props.theme.mainColors.primary};
  height: ${(props) => props.theme.spaceUnits.xl};
  box-shadow: inset 1px 4px 4px rgba(200, 200, 200, 0.25);
  color: ${(props) => props.theme.mainColors.textColor};

  &::placeholder {
    color: ${(props) => props.theme.mainColors.secondaryDarkAlpha};
  }

  &:focus {
    outline-color: ${(props) => props.theme.mainColors.secondaryDarkAlpha};
  }

  ${(props) => {
    if (props.disabled) {
      return css`
        background: ${(props) => props.theme.mainColors.secondary};
        border-color: ${(props) => props.theme.mainColors.secondaryDarkAlpha};
        pointer-events: none;
      `;
    }
  }}

  ${(props) => {
    if (props.touched && props.error) {
      return css`
        border-color: ${(props) => props.theme.statusColors.primaryLoss};
      `;
    }
  }}
`;
