import styled from 'styled-components';

export const NumberInputWrapper = styled.div`
  width: 100%;
  position: relative;
`;

export const InputPresetWrapper = styled.div`
  z-index: 100;
  position: absolute;
  right: ${(props) => props.theme.spaceUnits.xs};
  top: ${(props) => props.theme.spaceUnits.xxs};
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

export interface SelectTriggerProps {
  disabled?: boolean;
}

export const SelectTrigger = styled.div<SelectTriggerProps>`
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  border-color: ${(props) => props.theme.mainColors.secondaryDarkAlpha};
  border-style: solid;
  border-width: 1px;
  white-space: nowrap;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => (props.disabled ? props.theme.mainColors.secondary : props.theme.mainColors.primary)};
  border-radius: 0px;
  box-shadow: inset 1px 4px 4px rgba(200, 200, 200, 0.25);
  padding: 0px ${(props) => props.theme.spaceUnits.xxs} 0px ${(props) => props.theme.spaceUnits.m};

  &:focus {
    outline-color: ${(props) => props.theme.mainColors.secondaryDarkAlpha};
  }

  @media (${(props) => props.theme.mediaQueries.s}) {
    border-width: 1px 1px 1px 0px;
  }
`;

export const SelectField = styled.div`
  background: ${(props) => props.theme.mainColors.primary};
`;

export const Dropdown = styled.div`
  padding-left: ${(props) => props.theme.spaceUnits.s};
`;
