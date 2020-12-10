import styled, { css } from 'styled-components';

export interface IconProps {
  size?: 'normal' | 'medium' | 'small';
  pointer?: boolean;
  colored?: boolean;
}

export const IconsWrapper = styled.div<IconProps>`
  position: relative;
  display: inline;

  ${(props) =>
    props?.size === 'normal' &&
    css`
      height: 32px;
      width: 32px;
    `}
    
    ${(props) =>
      props?.size === 'medium' &&
      css`
        height: 24px;
        width: 24px;
      `}

  ${(props) =>
    props?.size === 'small' &&
    css`
      height: 16px;
      width: 16px;
    `}

    ${(props) =>
      props.pointer &&
      css`
        cursor: pointer;
      `}

  svg {
    g {
      fill: ${(props) => props.colored && props.theme.mainColors.textColor};
    }
    display: inline;
    overflow: visible;
    ${(props) =>
      props?.size === 'normal' &&
      css`
        height: 32px;
        width: 32px;
      `}
      ${(props) =>
        props?.size === 'medium' &&
        css`
          height: 24px;
          width: 24px;
        `}
    ${(props) =>
      props.size &&
      props.size === 'small' &&
      css`
        height: 16px;
        width: 16px;
      `}
  }
`;

export const Loading = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(196, 196, 196, 0.2);
`;
