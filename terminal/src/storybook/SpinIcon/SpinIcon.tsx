import styled, { keyframes } from 'styled-components';
import { CircleNotch } from '@styled-icons/fa-solid/CircleNotch';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const SpinIcon = styled(CircleNotch)`
  width: 16px;
  height: 16px;
  color: ineherit;
  animation: ${rotate} 2s infinite linear;
`;
