import BigNumber from 'bignumber.js';
import React from 'react';
import {
  GiCaesar,
  GiChariot,
  GiIcarus,
  GiMedusaHead,
  GiPadlock,
  GiPalisade,
  GiPegasus,
  GiSpartanHelmet,
  GiStorkDelivery,
  GiWingfoot,
} from 'react-icons/gi';
import { useHistory } from 'react-router';
import {
  Column,
  FilterValue,
  IdType,
  Row,
  TableOptions,
  useGlobalFilter,
  usePagination,
  useRowState,
  useSortBy,
  useTable,
} from 'react-table';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { CommonTable, ScrollableTable } from '~/components/Common/Table/Table';
import { RowData } from '~/components/Contexts/FundList/FundList';
import { Button } from '~/components/Form/Button/Button';
import { getNetworkName } from '~/config';
import { useConnectionState } from '~/hooks/useConnectionState';
import { useCurrency } from '~/hooks/useCurrency';
import { useFundList } from '~/hooks/useFundList';
import { Block } from '~/storybook/Block/Block';
import { IconName, Icons } from '~/storybook/Icons/Icons';
import { Spinner } from '~/storybook/Spinner/Spinner';
import { SectionTitle } from '~/storybook/Title/Title';
import { Tooltip } from '~/storybook/Tooltip/Tooltip';
import { TokenValue } from '~/TokenValue';
import { sortBigNumber } from '~/utils/sortBigNumber';
import { TableGlobalFilter } from './FundFilters';
import { FundSharePriceChart } from './FundSharePriceChart';

const coloredIcons = ['MLN', 'REN', 'ZRX'];

const columns = (prefix: string, history: any, currency: string): Column<RowData>[] => {
  return [
    {
      Header: 'Name',
      accessor: 'name',
      filter: 'text',
      headerProps: {
        style: {
          textAlign: 'left',
        },
      },
      cellProps: {
        style: {
          textAlign: 'left',
          verticalAlign: 'top',
          maxWidth: '250px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      },

      Cell: (cell) => (
        <span>
          {cell.value}
          <br />
          {cell.row.original.top5AUM && (
            <Tooltip value="Top 5 fund by AUM">
              <GiCaesar color="rgb(133,213,202)" size={20} />
            </Tooltip>
          )}{' '}
          {cell.row.original.top5SinceInception && (
            <Tooltip value="Top 5 performance since inception">
              <GiSpartanHelmet color="rgb(133,213,202)" size={20} />
            </Tooltip>
          )}{' '}
          {cell.row.original.top5MTD && (
            <Tooltip value="Top 5 performance MTD">
              <GiPegasus color="rgb(133,213,202)" size={20} />
            </Tooltip>
          )}{' '}
          {cell.row.original.top5Recent && (
            <Tooltip value="5 most recent funds">
              <GiStorkDelivery color="rgb(133,213,202)" size={20} />
            </Tooltip>
          )}{' '}
          {cell.row.original.top5Investments && (
            <Tooltip value="5 funds with most investors">
              <GiChariot color="rgb(133,213,202)" size={20} />
            </Tooltip>
          )}{' '}
          {cell.row.original.largeFund && (
            <Tooltip value="Large fund (> 100 ETH)">
              <GiWingfoot color="rgb(133,213,202)" size={20} />
            </Tooltip>
          )}{' '}
          {cell.row.original.underperformingFund && (
            <Tooltip value="Underperforming fund">
              <GiIcarus color="rgb(255,141,136)" size={20} />
            </Tooltip>
          )}{' '}
          {cell.row.original.tinyFund && (
            <Tooltip value="Tiny fund (< 1 ETH)">
              <GiMedusaHead color="rgb(255,141,136)" size={20} />
            </Tooltip>
          )}{' '}
          {cell.row.original.userWhitelist && (
            <Tooltip value="Fund operates a user whitelist">
              <GiPalisade color="grey" size={20} />
            </Tooltip>
          )}{' '}
          {cell.row.original.closed && (
            <Tooltip value="Fund is closed for investment">
              <GiPadlock color="grey" size={20} />
            </Tooltip>
          )}{' '}
        </span>
      ),
    },

    {
      Header: 'Age',
      accessor: 'age',
      sortType: 'basic',
    },

    {
      Header: (
        <>
          AUM
          <br />[{currency}]
        </>
      ),
      accessor: 'aumEth',
      sortType: 'basic',
      Cell: (cell) => (
        <>
          <FormattedNumber value={cell.row.original.aum} decimals={0} />
        </>
      ),
      cellProps: {
        style: {
          textAlign: 'right',
          verticalAlign: 'top',
        },
      },
      headerProps: {
        style: {
          textAlign: 'right',
        },
      },
    },
    {
      Header: 'Top 5 assets',
      accessor: 'holdings',
      disableSortBy: true,
      Cell: (cell) => {
        return cell.row.original.top5Holdings.map(([symbol, percentage]) => (
          <Tooltip key={symbol} value={`${symbol}: ${percentage.toFixed(2)}%`}>
            <Icons name={symbol as IconName} size="medium" colored={coloredIcons.includes(symbol)} />{' '}
          </Tooltip>
        ));
      },

      cellProps: {
        style: {
          textAlign: 'left',
          // maxWidth: '120px',
          verticalAlign: 'top',
        },
      },
      headerProps: {
        style: {
          textAlign: 'left',
        },
      },
    },
    {
      Header: (
        <>
          Since
          <br />
          inception
        </>
      ),
      accessor: 'returnSinceInception',
      sortType: (rowA, rowB, columnId) =>
        sortBigNumber(new BigNumber(rowA.values[columnId]), new BigNumber(rowB.values[columnId])),
      Cell: (cell) => <FormattedNumber value={cell.value} colorize={true} decimals={2} suffix="%" />,
      cellProps: {
        style: {
          textAlign: 'right',
          verticalAlign: 'top',
        },
      },
      headerProps: {
        style: {
          textAlign: 'right',
          maxWidth: '100px',
        },
      },
    },
    {
      Header: (
        <>
          Performance
          <br />
          MTD
        </>
      ),
      accessor: 'returnMTD',
      sortType: (rowA, rowB, columnId) =>
        sortBigNumber(new BigNumber(rowA.values[columnId]), new BigNumber(rowB.values[columnId])),
      Cell: (cell) => <FormattedNumber value={cell.value} colorize={true} decimals={2} suffix="%" />,
      cellProps: {
        style: {
          textAlign: 'right',
          verticalAlign: 'top',
        },
      },
      headerProps: {
        style: {
          textAlign: 'right',
        },
      },
    },
    {
      Header: (
        <>
          Performance
          <br />1 day
        </>
      ),
      accessor: 'returnSinceYesterday',
      sortType: (rowA, rowB, columnId) =>
        sortBigNumber(new BigNumber(rowA.values[columnId]), new BigNumber(rowB.values[columnId])),
      Cell: (cell) => <FormattedNumber value={cell.value} colorize={true} decimals={2} suffix="%" />,
      cellProps: {
        style: {
          textAlign: 'right',
          verticalAlign: 'top',
        },
      },
      headerProps: {
        style: {
          textAlign: 'right',
        },
      },
    },
    {
      Header: (
        <>
          Share Price
          <br />[{currency}]
        </>
      ),
      accessor: 'sharePrice',
      sortType: 'basic',
      Cell: (cell) => (
        <>
          <FormattedNumber value={cell.value} decimals={4} />
        </>
      ),
      cellProps: {
        style: {
          textAlign: 'right',
          verticalAlign: 'top',
        },
      },
      headerProps: {
        style: {
          textAlign: 'right',
        },
      },
    },

    {
      Header: 'Last month',
      // accessor: 'sharePrice',
      disableSortBy: true,
      Cell: (cell: any) => <FundSharePriceChart address={cell.row.original.address} />,
      cellProps: {
        style: {
          textAlign: 'right',
          verticalAlign: 'middle',
          alignItems: 'center',
          paddingTop: '5px',
          marginTop: 0,
          height: '80px',
        },
      },
      headerProps: {
        style: {
          textAlign: 'center',
        },
      },
    },

    {
      Header: 'Invest',
      accessor: 'address',
      disableSortBy: true,
      Cell: (cell) =>
        cell.row.original.userWhitelist || cell.row.original.closed ? (
          // <GiPadlock size="2rem" />
          <></>
        ) : (
          <Button
            kind="secondary"
            size="small"
            onClick={() => history.push(`/${prefix}/fund/${cell.row.original.address}/invest`)}
          >
            Invest
          </Button>
        ),
      cellProps: {
        style: {
          textAlign: 'center',
          verticalAlign: 'middle',
          height: '80px',
        },
      },
    },
  ];
};

export const FundOverview: React.FC = () => {
  const data = useFundList();
  const currency = useCurrency();
  const history = useHistory();
  const connection = useConnectionState();

  const prefix = getNetworkName(connection.network);

  const filterTypes = React.useMemo(
    () => ({
      custom: (rows: Row<RowData>[], ids: IdType<string>, filterValue: FilterValue) => {
        if (filterValue == null) {
          return rows;
        }

        return rows
          .filter((row) => {
            return filterValue.search
              ? row.values.name.toLowerCase().startsWith(filterValue.search.toLowerCase())
              : true;
          })
          .filter((row) => {
            if (!filterValue.aum?.length) {
              return true;
            }

            const sizes = filterValue.aum.map((value: string) => {
              const [min, max] = value.split('-');
              return { min, max };
            });

            return sizes.some((size: any) => !!(row.values.aumEth >= size.min && row.values.aumEth < size.max));
          })
          .filter((row) => {
            if (!filterValue.age?.length) {
              return true;
            }

            const ages = filterValue.age.map((value: string) => {
              const [min, max] = value.split('-');
              return { min, max };
            });

            return ages.some((age: any) => !!(row.values.age >= age.min && row.values.age < age.max));
          })
          .filter((row) => {
            if (!filterValue.assets?.length) {
              return true;
            }

            if (!row.values.holdings?.length) {
              return false;
            }

            return filterValue.assets.every((asset: string) =>
              row.values.holdings.some(
                (holding: TokenValue) => holding.token.symbol === asset && !holding.value?.isZero()
              )
            );
          })
          .filter((row) => {
            if (!filterValue.sinceInception?.length) {
              return true;
            }

            const returns = filterValue.sinceInception.map((value: string) => {
              const [min, max] = value.split('/');
              return { min: parseFloat(min), max: parseFloat(max) };
            });

            return returns.some(
              (ret: any) =>
                !!(
                  row.values.returnSinceInception.isGreaterThanOrEqualTo(ret.min) &&
                  row.values.returnSinceInception.isLessThan(ret.max)
                )
            );
          })
          .filter((row) => {
            if (!filterValue.mtd?.length) {
              return true;
            }

            const returns = filterValue.mtd.map((value: string) => {
              const [min, max] = value.split('/');
              return { min: parseFloat(min), max: parseFloat(max) };
            });

            return returns.some(
              (ret: any) =>
                !!(row.values.returnMTD.isGreaterThanOrEqualTo(ret.min) && row.values.returnMTD.isLessThan(ret.max))
            );
          })
          .filter((row) => {
            if (!filterValue.sinceYesterday?.length) {
              return true;
            }

            const returns = filterValue.sinceYesterday.map((value: string) => {
              const [min, max] = value.split('/');
              return { min: parseFloat(min), max: parseFloat(max) };
            });

            return returns.some(
              (ret: any) =>
                !!(
                  row.values.returnSinceYesterday.isGreaterThanOrEqualTo(ret.min) &&
                  row.values.returnSinceYesterday.isLessThan(ret.max)
                )
            );
          })
          .filter((row) => {
            if (!filterValue.badges?.length) {
              return true;
            }

            return filterValue.badges.every((badge: string) => !!(row.original as any)[badge]);
          });
      },
    }),
    []
  );

  const options: TableOptions<RowData> = React.useMemo(
    () => ({
      columns: columns(prefix || '', history, currency.currency),
      initialState: {
        hiddenColumns: ['age', 'top20AUM'],
        pageSize: 10,
      },
      data: data.list,
      rowProps: (row) => ({ onClick: () => history.push(`/${prefix}/fund/${row.original.address}`) }),
      filterTypes,
      globalFilter: 'custom',
    }),
    [data, history]
  );

  const table = useTable(options, useGlobalFilter, useSortBy, usePagination, useRowState);
  const filter = <TableGlobalFilter table={table} />;

  if (data.list.length === 0) {
    return (
      <Block>
        <SectionTitle>Melon Fund Universe</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  return (
    <>
      <Block>
        <SectionTitle>Melon Fund Universe</SectionTitle>
        <ScrollableTable>
          <CommonTable table={table} globalFilter={filter} />
        </ScrollableTable>
      </Block>
    </>
  );
};
