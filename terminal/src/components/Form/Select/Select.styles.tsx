import styled from 'styled-components';

export const SelectWrapper = styled.div`
  display: flex;
`;

export const SelecLabelWrapper = styled.span`
  display: flex;
  flex-direction: column;
`;

export const SelectIcon = styled.span`
  margin-top: 2px;
  margin-right: 10px;
`;

export const SelectLabel = styled.span`
  color: ${(props) => props.theme.mainColors.textColor};
  text-align: left;
  margin-top: 2px;
`;

export const SelectDescription = styled.span`
  font-size: ${(props) => props.theme.fontSizes.m};
  color: ${(props) => props.theme.mainColors.secondaryDark};
`;

export const ComponentsControl = styled.div`
  .melon__control {
    border-radius: 0px;
    border-color: ${(props) => props.theme.mainColors.secondaryDarkAlpha};
    border-style: solid;
    border-width: 1px;
    background: ${(props) => props.theme.mainColors.primary};
    box-shadow: inset 1px 4px 4px rgba(200, 200, 200, 0.25);
    min-height: ${(props) => props.theme.spaceUnits.xl};
  }
  &.melon__control:active {
    min-height: ${(props) => props.theme.spaceUnits.xl};
  }
`;

export const ComponentsMenuList = styled.div`
  border-radius: 0px;
  border-color: ${(props) => props.theme.mainColors.secondaryDarkAlpha};
  border-style: solid;
  border-width: 1px;
  background: ${(props) => props.theme.mainColors.primary};
  box-shadow: inset 1px 4px 4px rgba(200, 200, 200, 0.25);
`;

export const ComponentsSingleValue = styled.div`
  .melon__single-value {
    color: ${(props) => props.theme.mainColors.textColor};
  }
`;

export const ComponentsMultiValue = styled.div`
  .melon__multi-value {
    color: ${(props) => props.theme.mainColors.textColor};
    background: ${(props) => props.theme.mainColors.secondary};
  }
`;

export const ComponentsOption = styled.div`
  .melon__option {
    color: ${(props) => props.theme.mainColors.textColor};
  }
  .melon__option--is-focused {
    background: ${(props) => props.theme.mainColors.secondary};
  }
  .melon__option--is-selected {
    background: ${(props) => props.theme.mainColors.secondaryDarkAlpha};
  }
`;

export const IndicatorContainer = styled.div`
  .melon__dropdown-indicator {
    padding: 0px 8px;
  }
`;
