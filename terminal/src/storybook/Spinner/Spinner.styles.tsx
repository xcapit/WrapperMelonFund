import styled, { css, keyframes } from 'styled-components';
import { Logo as BaseLogo } from '~/storybook/Logo/Logo';
import { SpinnerProps } from '~/storybook/Spinner/Spinner';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export interface LoaderProps {
  color?: string;
}

export const Loader = styled.div<LoaderProps>`
  &,
  &::after {
    border-radius: 50%;
  }
  position: absolute;
  top: 0;
  border-style: solid;
  border-top-color: ${(props) => props.theme.otherColors.turquoise};
  border-right-color: ${(props) => props.theme.mainColors.primary};
  border-bottom-color: ${(props) => props.theme.otherColors.turquoise};
  border-left-color: ${(props) => props.theme.mainColors.primary};
  transform: translateZ(0);
  animation: ${rotate} 2s infinite linear;
`;

export const Text = styled.div`
  margin-top: ${(props) => props.theme.spaceUnits.s};
  text-align: center;
`;

export const Wrapper = styled.div`
  margin: 0 auto;
`;

export const Logo = styled(BaseLogo)``;

const sizes = {
  default: {
    spinner: 100,
    border: 3,
  },
  tiny: {
    spinner: 25,
    border: 1,
  },
  small: {
    spinner: 50,
    border: 2,
  },
  large: {
    spinner: 200,
    border: 8,
  },
  inflated: {
    spinner: 50,
    border: 4,
  },
};

export const Spinner = styled.div<SpinnerProps>`
  ${(props) => {
    const size = sizes[props.size || 'default'];

    return css`
      ${Wrapper}, ${Loader}, ${Logo} {
        width: ${size.spinner}px;
        height: ${size.spinner}px;
      }
      ${Loader} {
        border-width: ${size.border}px;
      }
    `;
  }}
`;

export const SpinnerPositioning = styled.div<SpinnerProps>`
  position: relative;
  margin: ${(props) => props.theme.spaceUnits.xxl} auto;

  ${(props) => {
    const size = sizes[props.size || 'default'];

    if (props.positioning === 'overlay') {
      return css`
        background-color: ${(props) => props.theme.mainColors.secondary};
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100%;
        z-index: 100;
        ${Spinner} {
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -${size.spinner / 2}px;
          margin-top: -${size.spinner / 2}px;
        }
      `;
    }

    if (props.positioning === 'centered') {
      return css`
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -${size.spinner / 2}px;
        margin-top: -${size.spinner / 2}px;
      `;
    }
  }}
`;
