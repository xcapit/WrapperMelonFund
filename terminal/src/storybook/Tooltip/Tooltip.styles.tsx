import styled from 'styled-components';

export const Container = styled.span`
  background-color: ${(props) => props.theme.mainColors.primary};
  color: ${(props) => props.theme.mainColors.textColor};
  border-radius: 3px;
  border: 1px solid silver;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  padding: 0.4rem;
  transition: opacity 0.3s;
  z-index: 2147483647;
`;

export const TooltipContainer = styled.div`
  margin-left: ${(props) => props.theme.spaceUnits.xxs};
  // margin-bottom: ${(props) => props.theme.spaceUnits.xxs};
`;
