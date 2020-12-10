import styled, { css } from 'styled-components';
import { Bar, BarContent } from '../Bar/Bar';
import { NavLink } from '../Link/Link';
import { Block } from '../Block/Block';

export const TabBar = styled(Bar)`
  padding: 0px;

  ${Block} & {
    margin: -${(props) => props.theme.spaceUnits.l};
    margin-bottom: ${(props) => props.theme.spaceUnits.l};
    width: auto;
  }
`;

export const TabBarContent = styled(BarContent)`
  ${Block} & {
    padding: 0;
  }
`;

export const TabBarSection = styled.div``;

const tabStyles = css`
  display: inline-block;
  position: relative;
  padding: ${(props) => props.theme.spaceUnits.m} ${(props) => props.theme.spaceUnits.xl};
  cursor: pointer;
  text-decoration: none;

  &::before {
    transition: ${(props) => props.theme.transition.defaultAll};
    position: absolute;
    content: '';
    bottom: -1px;
    right: 0;
    left: 0;
    width: 100%;
  }

  :hover::before {
    border-bottom: 3px solid ${(props) => props.theme.mainColors.secondaryDarkAlpha};
  }

  ${Block} & {
    padding-left: ${(props) => props.theme.spaceUnits.l};
    padding-right: ${(props) => props.theme.spaceUnits.l};
  }
`;

export interface TabItemProps {
  active?: boolean;
}

export const TabItem = styled.a<TabItemProps>`
  ${tabStyles}

  ${(props) =>
    props.active &&
    `
    &::before {
      border-bottom: 3px solid ${props.theme.mainColors.primaryDark};
    }
  `}
`;

export const TabLink = styled(NavLink)`
  ${tabStyles}

  &.active::before {
    border-bottom: 3px solid ${(props) => props.theme.mainColors.primaryDark};
  }
`;
