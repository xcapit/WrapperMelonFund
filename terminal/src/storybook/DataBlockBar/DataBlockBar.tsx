import styled from 'styled-components';
import { Bar, BarContent } from '../Bar/Bar';
import { DataBlock, DataLabel, Data } from '../DataBlock/DataBlock.styles';

export const DataBlockBar = styled(Bar)`
  position: relative;
  overflow: hidden;
  padding: ${(props) => props.theme.spaceUnits.l} 0px;
  &::before {
    content: '';
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 200;
    width: ${(props) => props.theme.spaceUnits.xxl};
    height: 100%;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0));
  }
  &::after {
    content: '';
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 200;
    width: ${(props) => props.theme.spaceUnits.xxl};
    height: 100%;
    background: linear-gradient(to left, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0));
  }
`;

export const DataBlockBarContent = styled(BarContent)`
  width: 100%;
  max-width: 100%;
  flex-wrap: nowrap;
  overflow-y: scroll;
  margin-bottom: -${(props) => props.theme.spaceUnits.m};
  padding: 0px ${(props) => props.theme.spaceUnits.s};
  @media (${(props) => props.theme.mediaQueries.s}) {
    max-width: 100%;
  }
  @media (${(props) => props.theme.mediaQueries.m}) {
    max-width: 100%;
  }
  @media (${(props) => props.theme.mediaQueries.l}) {
    max-width: 100%;
  }
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`;

export const BarDataBlock = styled(DataBlock)`
  display: block;
  position: relative;
  justify-content: space-between;
  padding: 0px;
  text-align: left;
  border-bottom: none;
  padding: 0px ${(props) => props.theme.spaceUnits.m};
`;

export const BarDataLabel = styled(DataLabel)`
  display: block;
  margin-bottom: ${(props) => props.theme.spaceUnits.xs};
  color: ${(props) => props.theme.mainColors.secondaryDark};
  font-size: ${(props) => props.theme.fontSizes.m};
  white-space: nowrap;
`;

export const BarData = styled(Data)`
  display: block;
  margin-bottom: 0px;
  color: ${(props) => props.theme.mainColors.primaryDark};
  font-size: ${(props) => props.theme.fontSizes.m};
  font-weight: ${(props) => props.theme.fontWeights.semiBold};
  white-space: nowrap;
`;
