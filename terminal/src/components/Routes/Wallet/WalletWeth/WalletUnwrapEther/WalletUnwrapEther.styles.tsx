import styled from 'styled-components';

export const WalletUnwrapEtherBalances = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin: 0 ${(props) => props.theme.spaceUnits.xs} ${(props) => props.theme.spaceUnits.xs} 0;
  color: ${(props) => props.theme.otherColors.grey};
`;

export const WalletUnwrapEtherBalance = styled.span`
  &:not(:first-child)::after {
    content: '';
    margin-right: ${(props) => props.theme.spaceUnits.xs};
    padding-right: ${(props) => props.theme.spaceUnits.xs};
    border-right: 1px solid;
  }
`;
