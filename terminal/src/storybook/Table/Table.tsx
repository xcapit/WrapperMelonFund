import styled, { css } from 'styled-components';

export interface ScrollableTableProps {
  maxHeight?: string;
}

export const ScrollableTable = styled.div<ScrollableTableProps>`
  overflow: auto;
  display: block;
  overflow-x: auto;
  white-space: nowrap;

  ${(props) =>
    props.maxHeight &&
    `
    max-height: ${props.maxHeight};
  `}
`;

export const Table = styled.table`
  background-color: ${(props) => props.theme.mainColors.primary};
  width: 100%;
  border-spacing: 0;
`;

export interface HeaderCellProps {
  hover?: boolean;
}

export const HeaderCell = styled.th<HeaderCellProps>`
  text-align: left;
  padding: ${(props) => props.theme.spaceUnits.s};
  cursor: ${(props) => props.hover && 'pointer'};
`;

export const HeaderCellRightAlign = styled.th<HeaderCellProps>`
  cursor: ${(props) => props.hover && 'pointer'};
  text-align: right;
  padding: ${(props) => props.theme.spaceUnits.s};
`;

export const HeaderRow = styled.tr`
  font-weight: bold;
  border-bottom: 1px solid ${(props) => props.theme.mainColors.textColor};
`;

export interface BodyCellProps {
  maxWidth?: string;
}

export const BodyCell = styled.td<BodyCellProps>`
  ${(props) =>
    props.maxWidth &&
    `
    max-width: ${props.maxWidth};
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  `}
  
  padding: ${(props) => props.theme.spaceUnits.s};
`;

export const BodyCellRightAlign = styled.td`
  padding: ${(props) => props.theme.spaceUnits.s};
  text-align: right;
`;

export interface BodyRowProps {
  highlighted?: boolean;
}

export const BodyRow = styled.tr<BodyRowProps>`
  line-height: 1;
  border-top: 1px solid ${(props) => props.theme.mainColors.secondaryDarkAlpha};

  &:not(:last-child) {
    border-bottom: 1px dashed ${(props) => props.theme.mainColors.border};
  }

  ${(props) => {
    if (props.highlighted) {
      return css`
        background-color: ${(props) => props.theme.mainColors.secondary};
      `;
    }
  }}
`;

export const NoEntries = styled.div``;

export const BodyRowHover = styled(BodyRow)`
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.mainColors.secondary};
  }
`;
