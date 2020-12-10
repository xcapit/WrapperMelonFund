import styled from 'styled-components';
import { animated } from 'react-spring';

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: 0px 0px ${(props) => props.theme.spaceUnits.xl};
  padding-left: 10px;
  padding-right: 10px;
`;

export const ProgressBar = styled.div`
  background-color: ${(props) => props.theme.otherColors.progressBar};
  position: absolute;
  width: calc(100% - 20px);
  border-radius: 10px;
  height: 10px;
`;

export const Progress = styled(animated.div)`
  height: 10px;
  width: 0;
  background-color: ${(props) => props.theme.mainColors.progressBar};
  border-radius: 10px;
`;

export const BadgeContainer = styled.div`
  width: 100%;
  display: flex;
  z-index: 1;
  justify-content: space-between;
`;
