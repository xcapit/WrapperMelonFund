import styled from 'styled-components';

export const ConnectionSelector = styled.div`
  position: relative;
`;

export const ConnectionSelectorToggle = styled.div`
  cursor: pointer;
`;

export const ConnectionSelectorBox = styled.div`
  position: absolute;
  top: 100%;
  width: 360px;
  right: -${(props) => props.theme.spaceUnits.s};
  margin-top: ${(props) => props.theme.spaceUnits.s};
  background: ${(props) => props.theme.mainColors.primary};
  padding: ${(props) => props.theme.spaceUnits.l};
  border: ${(props) => props.theme.border.borderDefault};
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.5);
  @media (${(props) => props.theme.mediaQueries.s}) {
    width: 400px;
  }
`;

export const ConnectionLabel = styled.a`
  cursor: pointer;
`;

export const ConnectionButton = styled.button`
  width: 100%;
  border: none;
  cursor: pointer;
  font-size: ${(props) => props.theme.fontSizes.l};
  color: ${(props) => props.theme.mainColors.primaryDark};
  background: ${(props) => props.theme.mainColors.secondary};
  padding: 0;

  &:hover {
    background: ${(props) => props.theme.mainColors.secondaryDarkAlpha};
  }
`;

export const ConnectionButtonWrapper = styled.div`
  margin-bottom: ${(props) => props.theme.spaceUnits.l};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding: ${(props) => props.theme.spaceUnits.l};
  padding-left: 70px;
`;

export const ButtonIcon = styled.div`
  position: absolute;
  left: ${(props) => props.theme.spaceUnits.l};
`;

export const ButtonText = styled.div``;
