import styled, { css } from 'styled-components';

export interface LogoWrapperProps {
  size?: 'small' | 'medium' | 'large';
}

export const LogoWrapper = styled.div<LogoWrapperProps>`
  position: relative;
  display: block;
  height: 100%;
  text-align: center;
  cursor: pointer;
  :hover{
    transition: ${(props) => props.theme.transition.defaultAll};
  }
  ${(props) =>
    props.size === 'small' &&
    css`
      height: 48px;
    `}
  ${(props) =>
    props.size === 'medium' &&
    css`
      height: 80px;
    `}
  ${(props) =>
    props.size === 'large' &&
    css`
      height: 160px;
    `}
`;

export const LogoName = styled.div`
  display: block;
  margin-bottom: 10px;
`;
