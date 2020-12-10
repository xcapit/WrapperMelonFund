import styled from 'styled-components';

export const Span = styled.span`
  display: inline-flex;
  align-items: center;
  text-decoration: underline;
  cursor: pointer;
  color: ${(props) => props.theme.mainColors.textColor};
  transition: ${(props) => props.theme.transition.defaultAll};
  :hover {
    opacity: 0.6;
  }
`;
