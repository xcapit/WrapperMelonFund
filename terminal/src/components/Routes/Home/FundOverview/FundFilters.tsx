import React from 'react';
import { CommonTableProps } from '~/components/Common/Table/Table';
import { useAsyncDebounce } from 'react-table';
import { InputField } from '~/components/Form/Input/Input';
import { SelectField } from '~/components/Form/Select/Select';
import { useEnvironment } from '~/hooks/useEnvironment';
import styled from 'styled-components';
import { FaFilter } from 'react-icons/fa';
import {
  GiCaesar,
  GiSpartanHelmet,
  GiPegasus,
  GiStorkDelivery,
  GiChariot,
  GiMedusaHead,
  GiIcarus,
  GiWingfoot,
} from 'react-icons/gi';

const Toolbar = styled.div`
  width: 100%;
  height: 40px;
  margin: 0 auto ${(props) => props.theme.spaceUnits.xl} auto;
`;

const Search = styled.div`
  float: left;
  min-width: 200px;
  margin-right: ${(props) => props.theme.spaceUnits.s};
  margin-top: ${(props) => props.theme.spaceUnits.xxxs};
`;

const Filter = styled.div`
  float: left;
  display: inline-block;
  vertical-align: top;
  height: 40px;
  text-align: center;
  margin-right: ${(props) => props.theme.spaceUnits.xl};
`;

const Label = styled.div`
  float: left;
  padding: ${(props) => props.theme.spaceUnits.xs} ${(props) => props.theme.spaceUnits.xs}
    ${(props) => props.theme.spaceUnits.xs} 0;
  display: inline-block;
  vertical-align: top;
`;

const FilterIcon = styled.div`
  float: left;
  padding-top: ${(props) => props.theme.spaceUnits.xs};
  padding-bottom: ${(props) => props.theme.spaceUnits.xs};
  cursor: pointer;
`;

const FilterRow = styled.div`
  float: right;
  display: block;
  text-align: center;
  width: 100%;
  background: ${(props) => props.theme.mainColors.secondary};
  border: ${(props) => props.theme.border.borderDefault};
  padding: ${(props) => props.theme.spaceUnits.xs};
  margin-bottom: ${(props) => props.theme.spaceUnits.xs};
`;

const SelectionFilter = styled.div`
  min-width: 200px;
  float: left;
  margin-right: ${(props) => props.theme.spaceUnits.xs};
  margin-bottom: ${(props) => props.theme.spaceUnits.xxs};
`;

const BadgeFilter = styled.div`
  min-width: 200px;
  float: left;
`;

const FundsPerPage = styled.div`
  float: right;
  min-width: 200px;
`;

const FundsPerPageSelection = styled.div`
  min-width: 150px;
  float: left;
  margin-top: ${(props) => props.theme.spaceUnits.xxxs};
`;

export interface TableGlobalFilterProps<TData extends object = any> extends CommonTableProps<TData> {}

export function TableGlobalFilter<TData extends object>(props: TableGlobalFilterProps<TData>) {
  const environment = useEnvironment()!;

  const [value, setValue] = React.useState(props.table.state.globalFilter);
  const [showFilters, setShowFilters] = React.useState(false);

  const onSearchChange = useAsyncDebounce((searchValue) => {
    props.table.setGlobalFilter({ ...value, search: searchValue });
  }, 200);

  // const sort = [
  //   { value: 'eth-desc', label: 'Largest' },
  //   { value: 'eth-asc', label: 'Smallest' },
  //   { value: 'age-asc', label: 'Oldest' },
  //   { value: 'age-desc', label: 'Newest' },
  //   { value: 'returnSinceInception-desc', label: 'Since inception - best' },
  //   { value: 'returnSinceInception-asc', label: 'Since inception - worst' },
  //   { value: 'returnYTD-desc', label: 'YTD - best' },
  //   { value: 'returnYTD-asc', label: 'YTD - worst' },
  //   { value: 'returnMTD-desc', label: 'MTD - best' },
  //   { value: 'returnMTD-asc', label: 'MTD - worst' },
  //   { value: 'returnSinceYesterday-desc', label: 'Since yesterday - best' },
  //   { value: 'returnSinceYesterday-asc', label: 'Since yesterday - worst' },
  // ];

  const aumFilterChoices = [
    { value: '100-1000000', label: 'More than 100 ETH' },
    { value: '50-100', label: '50 - 100 ETH' },
    { value: '10-50', label: '10 - 50 ETH' },
    { value: '1-10', label: '1 - 10 ETH' },
    { value: '0-1', label: 'Less than 1 ETH' },
  ];

  const ageFilterChoices = [
    { value: '365-1000000', label: 'More than a year' },
    { value: '183-365', label: '6 months - 1 year' },
    { value: '92-183', label: '3 months - 6 months' },
    { value: '31-92', label: '1 month - 3 months' },
    { value: '7-31', label: '1 week - 1 month' },
    { value: '0-7', label: 'Less than 1 week' },
  ];

  const tokens = environment.tokens
    .filter((token) => !token.historic)
    .map((token) => ({
      value: token.symbol,
      label: token.symbol,
      icon: token.symbol,
      description: token.name,
    }));

  const returnFilterChoices = [
    { value: '100/1000000', label: 'More than 100%' },
    { value: '50/100', label: '50% - 100%' },
    { value: '10/50', label: '10% - 50%' },
    { value: '0/10', label: '0% - 10%' },
    { value: '-10/0', label: '-10% - 0%' },
    { value: '-50/-10', label: '-50% - -10%' },
    { value: '-100/-50', label: 'Less than - 50%' },
  ];

  const badgesOptions = [
    { value: 'top5AUM', label: 'Largest funds', icon: <GiCaesar color="rgb(133,213,202)" /> },
    { value: 'top5SinceInception', label: 'Best since inception', icon: <GiSpartanHelmet color="rgb(133,213,202)" /> },
    { value: 'top5MTD', label: 'Best MTD', icon: <GiPegasus color="rgb(133,213,202)" /> },
    { value: 'top5Recent', label: 'Most recent', icon: <GiStorkDelivery color="rgb(133,213,202)" /> },
    { value: 'top5Investments', label: 'Most investments', icon: <GiChariot color="rgb(133,213,202)" /> },
    { value: 'largeFund', label: 'Large fund', icon: <GiWingfoot color="rgb(133,213,202)" /> },
    { value: 'tinyFund', label: 'Tiny fund', icon: <GiMedusaHead color="rgb(255,141,136)" /> },
    { value: 'underperformingFund', label: 'Underperforming fund', icon: <GiIcarus color="rgb(255,141,136)" /> },
  ];

  const pageSizeOptions = [5, 10, 20, 50].map((option) => ({ value: option, label: `${option} funds` }));
  const defaultPageSizeOption = pageSizeOptions.find((option) => option.value === props.table.state.pageSize);

  return (
    <>
      <Toolbar>
        <Label>Search: </Label>
        <Search>
          <InputField
            name="search"
            value={value?.search || ''}
            onChange={(e) => {
              setValue({ ...value, search: e.target.value });
              onSearchChange(e.target.value);
            }}
            placeholder="Search fund..."
          />
        </Search>

        <Filter>
          <Label>Filters: </Label>
          <FilterIcon>
            <FaFilter onClick={() => setShowFilters(!showFilters)} size="1.5rem" />
          </FilterIcon>
        </Filter>

        <FundsPerPage>
          <Label>Show:</Label>
          <FundsPerPageSelection>
            <SelectField
              name="pageSize"
              defaultValue={defaultPageSizeOption}
              options={pageSizeOptions}
              onChange={(e) => {
                props.table.setPageSize((e as any)?.value);
              }}
            />
          </FundsPerPageSelection>
        </FundsPerPage>
      </Toolbar>

      {showFilters && (
        <FilterRow>
          <SelectionFilter>
            <SelectField
              name="aum"
              options={aumFilterChoices}
              isMulti={true}
              onChange={(e) => {
                const aum = e?.map((item: any) => item.value);
                setValue({ ...value, aum });
                props.table.setGlobalFilter({ ...value, aum });
              }}
              placeholder="Fund size..."
              maxWidth="300"
            />
          </SelectionFilter>

          <SelectionFilter>
            <SelectField
              name="age"
              options={ageFilterChoices}
              isMulti={true}
              onChange={(e) => {
                const age = e?.map((item: any) => item.value);
                setValue({ ...value, age });
                props.table.setGlobalFilter({ ...value, age });
              }}
              placeholder="Fund age..."
              maxWidth="300"
            />
          </SelectionFilter>

          <SelectionFilter>
            <SelectField
              name="assets"
              options={tokens}
              isMulti={true}
              onChange={(e) => {
                const assets = e?.map((item: any) => item.value);
                setValue({ ...value, assets });
                props.table.setGlobalFilter({ ...value, assets });
              }}
              placeholder="Assets..."
              maxWidth="300"
            />
          </SelectionFilter>

          <SelectionFilter>
            <SelectField
              name="sinceInception"
              options={returnFilterChoices}
              isMulti={true}
              onChange={(e) => {
                const sinceInception = e?.map((item: any) => item.value);
                setValue({ ...value, sinceInception });
                props.table.setGlobalFilter({ ...value, sinceInception });
              }}
              placeholder="Since inception..."
              maxWidth="300"
            />
          </SelectionFilter>

          <SelectionFilter>
            <SelectField
              name="mtd"
              options={returnFilterChoices}
              isMulti={true}
              onChange={(e) => {
                const mtd = e?.map((item: any) => item.value);
                setValue({ ...value, mtd });
                props.table.setGlobalFilter({ ...value, mtd });
              }}
              placeholder="MTD..."
              maxWidth="300"
            />
          </SelectionFilter>

          <SelectionFilter>
            <SelectField
              name="sinceYesterday"
              options={returnFilterChoices}
              isMulti={true}
              onChange={(e) => {
                const sinceYesterday = e?.map((item: any) => item.value);
                setValue({ ...value, sinceYesterday });
                props.table.setGlobalFilter({ ...value, sinceYesterday });
              }}
              placeholder="Since yesterday..."
              maxWidth="300"
            />
          </SelectionFilter>

          <BadgeFilter>
            <SelectField
              name="badges"
              options={badgesOptions}
              isMulti={true}
              onChange={(e) => {
                const badges = e?.map((item: any) => item.value);
                setValue({ ...value, badges });
                props.table.setGlobalFilter({ ...value, badges });
              }}
              placeholder="Badges..."
              maxWidth="300"
            />
          </BadgeFilter>
        </FilterRow>
      )}
    </>
  );
}
