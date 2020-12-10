import styled, { css } from 'styled-components';

export const Skeleton = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export interface DebuggableSkeletonProps {
  debug?: boolean;
}

export const SkeletonHead = styled.div<DebuggableSkeletonProps>`
  flex: none;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 200;
  width: 100%;
  height: ${(props) => props.theme.skeleton.headerHeight};
  ${(props) =>
    props.debug &&
    css`
      border: 1px solid green;
    `}
`;

export const SkeletonBody = styled.div<DebuggableSkeletonProps>`
  position: relative;
  background-color: ${(props) => props.theme.mainColors.secondary};
  flex: 1 0 auto;
  width: 100%;
  min-height: calc(100vh - ${(props) => props.theme.skeleton.footerHeight});
  padding: ${(props) => props.theme.skeleton.headerHeight} 0px 0px;
  ${(props) =>
    props.debug &&
    css`
      border: 1px solid blue;
    `}
`;

export const SkeletonFeet = styled.div<DebuggableSkeletonProps>`
  position: relative;
  flex: none;
  height: ${(props) => props.theme.skeleton.footerHeight};
  ${(props) =>
    props.debug &&
    css`
      border: 1px solid yellow;
    `}
`;
