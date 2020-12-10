import styled, { keyframes } from 'styled-components';

export interface BadgeProps {
  selected?: boolean;
}

export const Badge = styled.div<BadgeProps>`
  display: inline-block;
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: ${(props) => props.theme.mainColors.textColor};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  background-color: ${(props) => (props.selected ? props.theme.mainColors.progressBar : props.theme.otherColors.badge)};
  transition: background-color 1000ms linear;
  z-index: 1;
  &:first-child {
    transform: translateX(-50%);
  }

  &:last-child {
    transform: translateX(50%);
  }
`;

const loaderAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const BadgeLoader = styled.div`
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 32px;
  height: 32px;
  border: 4px solid ${(props) => props.theme.mainColors.primaryDark};
  border-radius: 50%;
  animation: ${loaderAnimation} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: ${(props) => props.theme.mainColors.primaryDark} transparent transparent transparent;
`;

export const BadgeIndex = styled.span``;
