import styled from 'styled-components';
import { Container } from '~/storybook/Container/Container';
import { Title } from '~/storybook/Title/Title';

export const Header = styled.div`
  position: relative;
  width: 100%;
  border-bottom: ${(props) => props.theme.border.borderDefault};
  background-color: ${(props) => props.theme.mainColors.primary};
`;

export const HeaderContent = styled(Container)`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  height: auto;
  padding: 0px;
  @media (${(props) => props.theme.mediaQueries.s}) {
    padding: 0px 16px;
    height: ${(props) => props.theme.skeleton.headerHeight};
    justify-content: space-between;
    flex-wrap: nowrap;
  }
`;

export const LogoContainer = styled.div`
  position: relative;
  padding: 0px 8px;

  @media (${(props) => props.theme.mediaQueries.s}) {
    padding: 0px ${(props) => props.theme.spaceUnits.m};
  }
`;

export const LogoMobile = styled.div`
  display: block;
  padding-top: 4px;
  @media (${(props) => props.theme.mediaQueries.m}) {
    display: none;
  }
`;

export const LogoDesktop = styled.div`
  display: none;
  @media (${(props) => props.theme.mediaQueries.m}) {
    display: block;
  }
`;

export const CurrencySelectionItem = styled.div`
  font-size: ${(props) => props.theme.fontSizes.s};
  display: flex;
  padding: ${(props) => props.theme.spaceUnits.xs} 0px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  margin-right: ${(props) => props.theme.spaceUnits.xs};
  @media (${(props) => props.theme.mediaQueries.s}) {
    font-size: ${(props) => props.theme.fontSizes.l};
    margin-right: ${(props) => props.theme.spaceUnits.s};
  }
`;

export const ConnectionInfo = styled.div`
  display: flex;
  padding: ${(props) => props.theme.spaceUnits.xs} 0px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 0px;

  @media (${(props) => props.theme.mediaQueries.s}) {
    padding: 8px 0px;
  }
`;

export const ConnectionInfoItem = styled.div`
  margin-right: ${(props) => props.theme.spaceUnits.xs};
  padding: 0;

  a {
    background: ${(props) => props.theme.mainColors.secondary};
    font-size: ${(props) => props.theme.fontSizes.s};
    text-transform: uppercase;
    text-decoration: none;
    padding: ${(props) => props.theme.spaceUnits.xs} ${(props) => props.theme.spaceUnits.xs};
    display: inline-block;

    &.active {
      background: ${(props) => props.theme.mainColors.secondaryDarkAlpha};
      color: ${(props) => props.theme.mainColors.primary};
    }

    &:hover {
      opacity: 1;
      background: ${(props) => props.theme.mainColors.secondaryDarkAlpha};
    }
  }



  @media (${(props) => props.theme.mediaQueries.s}) {
    margin-right: ${(props) => props.theme.spaceUnits.s};
    a {
      font-size: ${(props) => props.theme.fontSizes.m};
    }
`;

export const HeaderTitle = styled(Title)`
  display: none;

  a {
    text-decoration: none;
  }

  @media (${(props) => props.theme.mediaQueries.m}) {
    display: block;
    margin-bottom: 0;
  }
`;
