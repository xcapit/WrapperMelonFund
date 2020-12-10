import styled, { css } from 'styled-components';

const ButtonBase = css`
  user-select: none;
  cursor: pointer;
  pointer-events: auto;
  background-color: transparent;
  position: relative;
  padding: 8px 10px;
  border-width: 0px;
  border-style: initial;
  border-color: initial;
  border-image: initial;
  margin-right: 12px;
`;

export const ButtonDay = styled.button`
  ${ButtonBase}
  transition: background-color 100ms ease-in-out 0s;
  overflow: hidden;

  :hover {
    background-color: ${(props) => props.theme.mainColors.secondary};
  }
`;

export const ButtonNight = styled.button`
  ${ButtonBase}
  // background-color: rgb(46, 52, 64);
  transition: background-color 100ms ease-in-out 0s;
  overflow: hidden;

  :hover {
    background-color: ${(props) => props.theme.mainColors.textColor};
    svg {
      fill: black;
    }
  }
`;
