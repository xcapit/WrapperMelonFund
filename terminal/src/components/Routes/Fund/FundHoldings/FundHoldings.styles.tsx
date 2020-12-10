import styled from 'styled-components';

export const HoldingIcon = styled.div`
  float: left;
  margin-right: 10px;
`;

export const HoldingText = styled.div`
  float: right;
  margin: auto;
  width: 50%;
`;

export const HoldingSymbol = styled.span`
  color: ${(props) => props.theme.mainColors.primaryDark};
`;

export const HoldingName = styled.span`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${(props) => props.theme.otherColors.grey};
`;
