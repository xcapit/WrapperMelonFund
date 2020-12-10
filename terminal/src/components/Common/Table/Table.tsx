import React from 'react';
import styled, { css } from 'styled-components';
import { TableInstance, useAsyncDebounce, usePagination, useGlobalFilter, useSortBy } from 'react-table';
import { Button } from '~/components/Form/Button/Button';
import { InputField } from '~/components/Form/Input/Input';

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

export const TableBody = styled.tbody``;

export const TableHeader = styled.thead``;

export const TableFooter = styled.tfoot``;

export interface HeaderCellProps {
  hover?: boolean;
}

export const HeaderCell = styled.th<HeaderCellProps>`
  padding: ${(props) => props.theme.spaceUnits.s};
  cursor: ${(props) => props.hover && 'pointer'};
`;

export const HeaderRow = styled.tr`
  font-weight: bold;
  border-bottom: 1px solid ${(props) => props.theme.mainColors.textColor};
`;

export const TableTools = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
`;

export const TableToolsFilter = styled.div`
  float: left;
`;

export const TableToolsPagination = styled.div`
  float: right;
`;

export const SearchInput = styled.input`
  position: relative;
  padding: 0px ${(props) => props.theme.spaceUnits.m};
  border: 1px solid ${(props) => props.theme.mainColors.secondaryDarkAlpha};
  border-radius: 0;
  background: ${(props) => props.theme.mainColors.primary};
  height: ${(props) => props.theme.spaceUnits.xxl};
  box-shadow: inset 1px 4px 4px rgba(200, 200, 200, 0.25);
  color: ${(props) => props.theme.mainColors.textColor};

  &::placeholder {
    color: ${(props) => props.theme.mainColors.secondaryDarkAlpha};
  }

  &:focus {
    outline-color: ${(props) => props.theme.mainColors.secondaryDarkAlpha};
  }
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

export interface BodyRowProps {
  highlighted?: boolean;
}

export const BodyRow = styled.tr<BodyRowProps>`
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

  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.mainColors.secondary};
  }
`;

export const NoEntries = styled.div``;

export const BodyRowHover = styled(BodyRow)`
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.mainColors.secondary};
  }
`;

export interface CommonTableProps<TData extends object = any> {
  table: TableInstance<TData>;
  globalFilter?: JSX.Element;
  globalSort?: JSX.Element;
}

export function CommonTable<TData extends object>(props: CommonTableProps<TData>) {
  const hasPagination = props.table.plugins.includes(usePagination);
  const hasSortBy = props.table.plugins.includes(useSortBy);
  const hasGlobalFilter = props.table.plugins.includes(useGlobalFilter);

  const header = props.table.headerGroups.map((headerGroup) => {
    const cells = headerGroup.headers.map((column) => {
      const propGetter = {
        ...(hasSortBy && column.getSortByToggleProps()),
        ...column.headerProps,
      };

      const isSorted = hasSortBy && column.isSorted;
      const sortByIndicator = isSorted ? <span>{column.isSortedDesc ? '↓' : '↑'}</span> : null;

      return (
        <HeaderCell {...column.getHeaderProps(propGetter)} hover={!column.disableSortBy}>
          {column.render('Header')}
          {sortByIndicator}
          <div>{column.Filter && column.render('Filter')}</div>
        </HeaderCell>
      );
    });

    return <HeaderRow {...headerGroup.getHeaderGroupProps()}>{cells}</HeaderRow>;
  });

  const rows = hasPagination ? props.table.page : props.table.rows;
  const body = rows.map((row) => {
    props.table.prepareRow(row);

    return (
      <BodyRow {...row.getRowProps(props.table.rowProps?.(row))}>
        {row.cells.map((cell) => {
          return <BodyCell {...cell.getCellProps(cell.column.cellProps)}>{cell.render('Cell')}</BodyCell>;
        })}
      </BodyRow>
    );
  });

  const pagination = hasPagination ? <TablePagination<TData> table={props.table} /> : null;

  const filter =
    props.globalFilter ||
    (hasGlobalFilter ? (
      <TableToolsFilter>
        <TableGlobalFilter<TData> table={props.table} />
      </TableToolsFilter>
    ) : null);

  return (
    <>
      <TableTools>{filter}</TableTools>
      <Table {...props.table.getTableProps()}>
        <TableHeader>{header}</TableHeader>
        <TableBody {...props.table.getTableBodyProps()}>{body}</TableBody>
      </Table>
      <TableTools>
        <TableToolsPagination>{pagination}</TableToolsPagination>
      </TableTools>
    </>
  );
}

export interface TablePaginationProps<TData extends object = any> extends CommonTableProps<TData> {}

export function TablePagination<TData extends object>(props: TablePaginationProps<TData>) {
  if (props.table.pageOptions.length < 2) {
    return <></>;
  }

  return (
    <div>
      <Button
        onClick={() => props.table.gotoPage(0)}
        disabled={!props.table.canPreviousPage}
        size="extrasmall"
        kind="secondary"
      >
        {'<<'}
      </Button>
      <Button
        onClick={() => props.table.previousPage()}
        disabled={!props.table.canPreviousPage}
        size="extrasmall"
        kind="secondary"
      >
        {'<'}
      </Button>
      <Button
        onClick={() => props.table.nextPage()}
        disabled={!props.table.canNextPage}
        size="extrasmall"
        kind="secondary"
      >
        {'>'}
      </Button>
      <Button
        onClick={() => props.table.gotoPage(props.table.pageCount - 1)}
        disabled={!props.table.canNextPage}
        size="extrasmall"
        kind="secondary"
      >
        {'>>'}
      </Button>{' '}
      <span>
        Page{' '}
        <strong>
          {props.table.state.pageIndex + 1} of {props.table.pageOptions.length}
        </strong>{' '}
      </span>
    </div>
  );
}

export interface TableGlobalFilterProps<TData extends object = any> extends CommonTableProps<TData> {}

export function TableGlobalFilter<TData extends object>(props: TableGlobalFilterProps<TData>) {
  const count = props.table.preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(props.table.state.globalFilter);
  const onChange = useAsyncDebounce((value) => {
    props.table.setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span>
      <InputField
        name="search"
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`Search...`}
      />
    </span>
  );
}
