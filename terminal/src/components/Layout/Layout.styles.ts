import styled from 'styled-components';
import { Icons as BaseIcons } from '~/storybook/Icons/Icons';

export const AppName = styled.span`
  display: none;
  margin-left: ${(props) => props.theme.spaceUnits.s};
  @media (${(props) => props.theme.mediaQueries.m}) {
    display: block;
  }
`;

export const Icons = styled(BaseIcons)`
  display: none;
  @media (${(props) => props.theme.mediaQueries.s}) {
    display: inline-block;
  }
`;
