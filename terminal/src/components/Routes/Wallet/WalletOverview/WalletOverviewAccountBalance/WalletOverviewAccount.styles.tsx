import styled from 'styled-components';

export const Balance = styled.span`
  margin-right: ${(props) => props.theme.spaceUnits.s};
  margin-bottom: ${(props) => props.theme.spaceUnits.s};
  background: ${(props) => props.theme.mainColors.secondary};
  padding: ${(props) => props.theme.spaceUnits.xs} ${(props) => props.theme.spaceUnits.s};
  display: inline-block;
`;
