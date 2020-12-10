import styled from 'styled-components';

export const NumberInputWrapper = styled.div`
  width: 100%;
  position: relative;
`;

export const InputPresetWrapper = styled.div`
  z-index: 100;
  position: absolute;
  right: 8px;
  top: 4px;
`;

export const InputContainer = styled.div`
  display: flex-block;
  flex-wrap: wrap;
  margin-bottom: 10px;
  @media (${(props) => props.theme.mediaQueries.s}) {
    display: flex;
    flex-wrap: nowrap;
  }
`;

export const TokenWrapper = styled.div`
  border-color: ${(props) => props.theme.mainColors.secondaryDarkAlpha};
  border-style: solid;
  border-width: 1px;
  white-space: nowrap;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.mainColors.primary};
  border-radius: 0;
  color: ${(props) => props.theme.mainColors.textColor};
  box-shadow: inset 1px 4px 4px rgba(200, 200, 200, 0.25);
  padding: 0px ${(props) => props.theme.spaceUnits.m};
  &:focus {
    outline-color: ${(props) => props.theme.mainColors.secondaryDarkAlpha};
  }

  @media (${(props) => props.theme.mediaQueries.s}) {
    border-width: 1px 1px 1px 0px;
  }
`;
