import styled from 'styled-components';

export const Footer = styled.div`
  display: flex;
  background-color: ${(props) => props.theme.mainColors.secondary};
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  height: ${(props) => props.theme.skeleton.footerHeight};
  padding: 0px ${(props) => props.theme.spaceUnits.xs};
  border-top: 1px dotted ${(props) => props.theme.otherColors.grey};

  @media (${(props) => props.theme.mediaQueries.s}) {
    justify-content: space-between;
    padding: 0px ${(props) => props.theme.spaceUnits.m};
  }
`;

export const FooterNavigation = styled.div`
  margin: auto;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  text-transform: uppercase;
`;

export const FooterItem = styled.div`
  &::before {
    content: '|';
    margin-right: ${(props) => props.theme.spaceUnits.xxs};
    padding-left: ${(props) => props.theme.spaceUnits.xxs};
    color: ${(props) => props.theme.otherColors.grey};
  }
  &:first-child::before {
    content: '';
    margin-right: 0;
    padding-left: 0;
  }
`;
