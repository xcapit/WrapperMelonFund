import styled from 'styled-components';

export const Block = styled.div`
  position: relative;
  width: 100%;
  padding: ${(props) => props.theme.spaceUnits.l};
  border: ${(props) => props.theme.border.borderDefault};
  border-radius: ${(props) => props.theme.border.borderRadius};
  background: ${(props) => props.theme.mainColors.primary};

  &:not(:last-child) {
    margin-bottom: ${(props) => props.theme.spaceUnits.l};
  }
`;

export const BlockSection = styled.div`
  position: relative;
  width: 100%;
  &:not(:last-child) {
    margin-bottom: ${(props) => props.theme.spaceUnits.xl};
  }
`;

export const BlockActions = styled.div`
  position: relative;
  width: 100%;
  margin-top: ${(props) => props.theme.spaceUnits.xl};
  display: flex;
  justify-content: flex-end;
`;
