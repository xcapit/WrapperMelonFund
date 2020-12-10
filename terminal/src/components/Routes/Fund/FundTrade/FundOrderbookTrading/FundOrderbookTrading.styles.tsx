import styled from 'styled-components';

export const FundOrderbookTrading = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;
  @media (${(props) => props.theme.mediaQueries.m}) {
    flex-direction: row;
  }
`;

export const FundOrderbook = styled.div`
  flex: 0.5 1;
  margin-top: ${(props) => props.theme.spaceUnits.l};
  @media (${(props) => props.theme.mediaQueries.m}) {
    padding-left: ${(props) => props.theme.spaceUnits.l};
    border-left: 1px solid #c4c4c4;
  }
`;

export const FundOrderbookForm = styled.div`
  flex: 0.5 1;
  @media (${(props) => props.theme.mediaQueries.m}) {
    padding-right: ${(props) => props.theme.spaceUnits.l};
  }
`;

export const FundOrderbookFooter = styled.div`
  font-size: ${(props) => props.theme.fontSizes.xs};
  text-align: right;
`;
