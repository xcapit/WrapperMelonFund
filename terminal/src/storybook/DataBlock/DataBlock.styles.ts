import styled from 'styled-components';

export const DataBlock = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  justify-content: space-between;
  padding: 0px;
  text-align: right;
  border-bottom: 1px dashed ${(props) => props.theme.mainColors.secondaryDark};
  padding-top: ${(props) => props.theme.spaceUnits.xs};
  @media (${(props) => props.theme.mediaQueries.m}) {
    display: block;
    width: auto;
    padding: 0px ${(props) => props.theme.spaceUnits.m};
    border-bottom: none;
  }
`;

export const DataLabel = styled.p`
  display: inline-block;
  margin-bottom: ${(props) => props.theme.spaceUnits.xs};
  margin-right: ${(props) => props.theme.spaceUnits.xs};
  color: ${(props) => props.theme.mainColors.textColor};
  white-space: nowrap;
  @media (${(props) => props.theme.mediaQueries.m}) {
    display: block;
    margin-right: 0px;
  }
`;

export const Data = styled.p`
  display: inline-block;
  margin-bottom: 0px;
  color: ${(props) => props.theme.mainColors.primaryDark};
  font-weight: ${(props) => props.theme.fontWeights.semiBold};
  white-space: nowrap;
  @media (${(props) => props.theme.mediaQueries.m}) {
    display: block;
  }
`;

export const DataBlockSection = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  margin-top: ${(props) => props.theme.spaceUnits.l};
  @media (${(props) => props.theme.mediaQueries.m}) {
    flex-wrap: nowrap;
    margin-top: 0px;
  }
`;
