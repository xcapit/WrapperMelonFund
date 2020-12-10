import styled, { css } from 'styled-components';

export const RadioButtonContainer = styled.div`
  position: relative;
  display: block;
  margin-bottom: ${(props) => props.theme.spaceUnits.s};
  text-align: left;
`;

export const RadioButtonMask = styled.span`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: ${(props) => props.theme.spaceUnits.m};
  height: ${(props) => props.theme.spaceUnits.m};
  border-radius: 100%;
  border: 2px solid ${(props) => props.theme.mainColors.primaryDark};
  transition: all 0.2s ease-in-out;
`;

export const RadioButtonIcon = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${(props) => props.theme.spaceUnits.xxs};
  height: ${(props) => props.theme.spaceUnits.xxs};
  border-radius: 100%;
  transform: translate(-50%, -50%);
  background: transparent;
  transition: all 0.2s ease-in-out;
`;

export const RadioButtonLabel = styled.label`
  position: relative;
  vertical-align: middle;
  padding-left: ${(props) => props.theme.spaceUnits.xs};
  cursor: pointer;
`;

export const RadioButtonInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  width: ${(props) => props.theme.spaceUnits.m};
  height: ${(props) => props.theme.spaceUnits.m};
  opacity: 0;
  margin: 0px;
  cursor: pointer;

  &:hover + ${RadioButtonMask} {
    ${RadioButtonIcon} {
      background: ${(props) => props.theme.mainColors.primaryDark};
    }
  }

  &:checked + ${RadioButtonMask} {
    background: ${(props) => props.theme.mainColors.primaryDark};

    ${RadioButtonIcon} {
      background: ${(props) => props.theme.mainColors.primary};
    }
  }

  &:hover:checked + ${RadioButtonMask} {
    background: ${(props) => props.theme.mainColors.secondaryDark};
  }

  ${(props) =>
    props.disabled &&
    css`
      pointer-events: none;

      & + ${RadioButtonMask} {
        border: 2px solid ${(props) => props.theme.mainColors.secondaryDark};
        background: ${(props) => props.theme.mainColors.secondary};
      }

      &:checked + ${RadioButtonMask} {
        background: ${(props) => props.theme.mainColors.secondaryDark};
      }

      & ~ ${RadioButtonLabel} {
        color: ${(props) => props.theme.mainColors.secondaryDark};
        pointer-events: none;
      }
    `}
`;
