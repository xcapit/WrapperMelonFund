/// <reference types="react-scripts" />

import 'styled-components';
import { Theme } from '~/theme';
import { Deployment, NetworkEnum } from './types';

import {
  UseColumnOrderInstanceProps,
  UseColumnOrderState,
  UseExpandedHooks,
  UseExpandedInstanceProps,
  UseExpandedOptions,
  UseExpandedRowProps,
  UseExpandedState,
  UseFiltersColumnOptions,
  UseFiltersColumnProps,
  UseFiltersInstanceProps,
  UseFiltersOptions,
  UseFiltersState,
  UseGlobalFiltersColumnOptions,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersOptions,
  UseGlobalFiltersState,
  UseGroupByCellProps,
  UseGroupByColumnOptions,
  UseGroupByColumnProps,
  UseGroupByHooks,
  UseGroupByInstanceProps,
  UseGroupByOptions,
  UseGroupByRowProps,
  UseGroupByState,
  UsePaginationInstanceProps,
  UsePaginationOptions,
  UsePaginationState,
  UseResizeColumnsColumnOptions,
  UseResizeColumnsColumnProps,
  UseResizeColumnsOptions,
  UseResizeColumnsState,
  UseRowSelectHooks,
  UseRowSelectInstanceProps,
  UseRowSelectOptions,
  UseRowSelectRowProps,
  UseRowSelectState,
  UseRowStateCellProps,
  UseRowStateInstanceProps,
  UseRowStateOptions,
  UseRowStateRowProps,
  UseRowStateState,
  UseSortByColumnOptions,
  UseSortByColumnProps,
  UseSortByHooks,
  UseSortByInstanceProps,
  UseSortByOptions,
  UseSortByState,
} from 'react-table';

declare module 'console' {
  export = typeof import('console');
}

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

declare global {
  declare namespace NodeJS {
    export interface ProcessEnv {
      MELON_MAINNET: string;
      MELON_MAINNET_SUBGRAPH: string;
      MELON_MAINNET_SUBGRAPH_NEW: string;
      MELON_MAINNET_DEPLOYMENT?: string;
      MELON_MAINNET_PROVIDER: string;
      MELON_KOVAN: string;
      MELON_KOVAN_SUBGRAPH: string;
      MELON_KOVAN_SUBGRAPH_NEW: string;
      MELON_KOVAN_DEPLOYMENT?: string;
      MELON_KOVAN_PROVIDER: string;
      MELON_RINKEBY: string;
      MELON_RINKEBY_SUBGRAPH: string;
      MELON_RINKEBY_SUBGRAPH_NEW: string;
      MELON_RINKEBY_DEPLOYMENT?: string;
      MELON_RINKEBY_PROVIDER: string;
      MELON_TESTNET: string;
      MELON_TESTNET_SUBGRAPH: string;
      MELON_TESTNET_SUBGRAPH_NEW: string;
      MELON_TESTNET_DEPLOYMENT?: string;
      MELON_TESTNET_PROVIDER: string;
      MELON_INCLUDE_GRAPHIQL: string;
      MELON_FORTMATIC_KEY: string;
      MELON_API_GATEWAY: string;
      MELON_MAX_EXPOSURE: string;
      MELON_TELEGRAM_API: string;
      MELON_RATES_API: string;
      MELON_KYC_VERIFY_EMAIL_API: string;
      MELON_KYC_FUNDS: string;
    }
  }
}

declare module 'react-table' {
  // take this file as-is, or comment out the sections that don't apply to your plugin configuration

  export interface TableOptions<D extends object>
    extends UseExpandedOptions<D>,
      UseFiltersOptions<D>,
      UseGlobalFiltersOptions<D>,
      UseGroupByOptions<D>,
      UsePaginationOptions<D>,
      UseResizeColumnsOptions<D>,
      UseRowSelectOptions<D>,
      UseRowStateOptions<D>,
      UseSortByOptions<D> {
    rowProps?: (row: Row<D>) => React.HTMLAttributes<HTMLTableRowElement>;
  }

  export interface Hooks<D extends object = {}>
    extends UseExpandedHooks<D>,
      UseGroupByHooks<D>,
      UseRowSelectHooks<D>,
      UseSortByHooks<D> {}

  export interface TableInstance<D extends object = {}>
    extends UseColumnOrderInstanceProps<D>,
      UseExpandedInstanceProps<D>,
      UseFiltersInstanceProps<D>,
      UseGlobalFiltersInstanceProps<D>,
      UseGroupByInstanceProps<D>,
      UsePaginationInstanceProps<D>,
      UseRowSelectInstanceProps<D>,
      UseRowStateInstanceProps<D>,
      UseSortByInstanceProps<D> {}

  export interface TableState<D extends object = {}>
    extends UseColumnOrderState<D>,
      UseExpandedState<D>,
      UseFiltersState<D>,
      UseGlobalFiltersState<D>,
      UseGroupByState<D>,
      UsePaginationState<D>,
      UseResizeColumnsState<D>,
      UseRowSelectState<D>,
      UseRowStateState<D>,
      UseSortByState<D> {}

  export interface ColumnInterface<D extends object = {}>
    extends UseFiltersColumnOptions<D>,
      UseGlobalFiltersColumnOptions<D>,
      UseGroupByColumnOptions<D>,
      UseResizeColumnsColumnOptions<D>,
      UseSortByColumnOptions<D> {
    headerProps?: React.ThHTMLAttributes<HTMLTableHeaderCellElement>;
    cellProps?: React.TdHTMLAttributes<HTMLTableDataCellElement>;
  }

  export interface ColumnInstance<D extends object = {}>
    extends UseFiltersColumnProps<D>,
      UseGroupByColumnProps<D>,
      UseResizeColumnsColumnProps<D>,
      UseSortByColumnProps<D> {}

  export interface Cell<D extends object = {}, V = any> extends UseGroupByCellProps<D>, UseRowStateCellProps<D> {}

  export interface Row<D extends object = {}>
    extends UseExpandedRowProps<D>,
      UseGroupByRowProps<D>,
      UseRowSelectRowProps<D>,
      UseRowStateRowProps<D> {}
}
