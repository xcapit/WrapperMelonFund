import styled from 'styled-components';
import { Block } from '../Block/Block';

export const Dictionary = styled(Block)``;

export const DictionaryDivider = styled.div`
  width: 100%;
  height: ${(props) => props.theme.spaceUnits.m};
  @media (${(props) => props.theme.mediaQueries.s}) {
    height: ${(props) => props.theme.spaceUnits.l};
  }
`;

export const DictionaryEntry = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-bottom: ${(props) => props.theme.spaceUnits.xs};
  @media (${(props) => props.theme.mediaQueries.s}) {
    flex-wrap: nowrap;
    margin-bottom: ${(props) => props.theme.spaceUnits.xxs};
  }
`;

export const DictionaryLabel = styled.div`
  color: ${(props) => props.theme.mainColors.secondaryDarkAlpha};
  @media (${(props) => props.theme.mediaQueries.s}) {
    width: 50%;
  }
`;

interface DictionaryDataProps {
  textAlign?: 'center' | 'left' | 'right';
}

export const DictionaryData = styled.div<DictionaryDataProps>`
  width: 100%;
  text-align: ${(props) => props.textAlign || 'left'};
  @media (${(props) => props.theme.mediaQueries.s}) {
    width: 50%;
    padding-left: ${(props) => props.theme.spaceUnits.s};
  }
`;
