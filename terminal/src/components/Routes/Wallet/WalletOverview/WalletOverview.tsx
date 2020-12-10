import React from 'react';
import { Spinner } from '~/storybook/Spinner/Spinner';
import { useFundParticipationOverviewQuery } from '~/components/Routes/Wallet/WalletOverview/FundParticipationOverview.query';
import { WalletOverviewInvestmentRequest } from './WalletOverviewInvestmentRequest/WalletOverviewInvestmentRequest';
import { WalletOverviewManagedFund } from './WalletOverviewManagedFund/WalletOverviewManagedFund';
import { WalletOverviewInvestedFund } from './WalletOverviewInvestedFund/WalletOverviewInvestedFund';
import { WalletOverviewAccountBalance } from './WalletOverviewAccountBalance/WalletOverviewAccountBalance';
import { useAccount } from '~/hooks/useAccount';
import { Block } from '~/storybook/Block/Block';
import { SectionTitle } from '~/storybook/Title/Title';
import { GridRow, Grid, GridCol } from '~/storybook/Grid/Grid';
import {
  ScrollableTable,
  BodyRow,
  BodyCell,
  HeaderCell,
  Table,
  HeaderRow,
  HeaderCellRightAlign,
} from '~/storybook/Table/Table';
import { useVersionQuery } from '~/components/Layout/Version.query';

const fundHeadings = [
  { name: 'Name', align: 'left' },
  { name: 'Inception', align: 'left' },
  { name: 'AUM [ETH]', align: 'right' },
  { name: 'Share price', align: 'right' },
  { name: 'Change', align: 'right' },
  { name: '# shares', align: 'right' },
  { name: 'Protocol', align: 'left' },
  { name: 'Status', align: 'left' },
];
const redeemHeadings = [
  { name: 'Name', align: 'left' },
  { name: 'Inception', align: 'left' },
  { name: 'AUM [ETH]', align: 'right' },
  { name: 'Share price', align: 'right' },
  { name: 'Change', align: 'right' },
  { name: '# shares', align: 'right' },
  { name: 'Protocol', align: 'left' },
  { name: 'Status', align: 'left' },
];
const requestHeadings = [
  { name: 'Fund name', align: 'left' },
  { name: 'Request date', align: 'left' },
  { name: 'Request asset', align: 'left' },
  { name: 'Request amount', align: 'right' },
  { name: 'Requested shares', align: 'right' },
  { name: 'Status', align: 'left' },
];

export const WalletOverview: React.FC = () => {
  const account = useAccount();
  const [version] = useVersionQuery();

  const [invested, requests, managed, query] = useFundParticipationOverviewQuery(account.address);
  const managedHeader = fundHeadings.map((heading, index) => {
    if (heading.align === 'left') {
      return <HeaderCell key={index}>{heading.name}</HeaderCell>;
    }
    return <HeaderCellRightAlign key={index}>{heading.name}</HeaderCellRightAlign>;
  });
  const managedEmpty = !(managed && managed.length);
  const managedRows = !managedEmpty ? (
    managed.map((fund) => <WalletOverviewManagedFund fund={fund} key={fund.address} version={version} />)
  ) : (
    <BodyRow>
      <BodyCell colSpan={12}>You do not manage any funds.</BodyCell>
    </BodyRow>
  );

  const investedHeader = redeemHeadings.map((heading, index) => {
    if (heading.align === 'left') {
      return <HeaderCell key={index}>{heading.name}</HeaderCell>;
    }
    return <HeaderCellRightAlign key={index}>{heading.name}</HeaderCellRightAlign>;
  });
  const investedEmpty = !(invested && invested.length);
  const investedRows = !investedEmpty ? (
    invested.map((fund) => <WalletOverviewInvestedFund fund={fund} key={fund.address} version={version} />)
  ) : (
    <BodyRow>
      <BodyCell colSpan={12}>You don't own any shares in any funds.</BodyCell>
    </BodyRow>
  );

  const requestsHeader = requestHeadings.map((heading, index) => {
    if (heading.align === 'left') {
      return <HeaderCell key={index}>{heading.name}</HeaderCell>;
    }
    return <HeaderCellRightAlign key={index}>{heading.name}</HeaderCellRightAlign>;
  });
  const requestsEmpty = !(requests && requests.length);
  const requestsRows = !requestsEmpty ? (
    requests.map((request) => (
      <WalletOverviewInvestmentRequest account={account.address} {...request} key={request.address} />
    ))
  ) : (
    <BodyRow>
      <BodyCell colSpan={12}>You do not have any pending investment requests.</BodyCell>
    </BodyRow>
  );

  return (
    <Grid>
      <GridRow>
        <GridCol xs={12} sm={12}>
          <Block>
            <SectionTitle>Managed Funds</SectionTitle>
            {query.loading && <Spinner />}

            {!query.loading && (
              <ScrollableTable>
                <Table>
                  <thead>
                    <HeaderRow>{managedHeader}</HeaderRow>
                  </thead>
                  <tbody>{managedRows}</tbody>
                </Table>
              </ScrollableTable>
            )}
          </Block>
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol xs={12} sm={12}>
          <Block>
            <SectionTitle>Funds with Owned Shares</SectionTitle>
            {query.loading && <Spinner />}

            {!query.loading && (
              <ScrollableTable>
                <Table>
                  <thead>
                    <HeaderRow>{investedHeader}</HeaderRow>
                  </thead>
                  <tbody>{investedRows}</tbody>
                </Table>
              </ScrollableTable>
            )}
          </Block>
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol xs={12} sm={12}>
          <Block>
            <SectionTitle>Pending Investment Requests</SectionTitle>
            {query.loading && <Spinner />}

            {!query.loading && (
              <ScrollableTable>
                <Table>
                  <thead>
                    <HeaderRow>{requestsHeader}</HeaderRow>
                  </thead>
                  <tbody>{requestsRows}</tbody>
                </Table>
              </ScrollableTable>
            )}
          </Block>
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol xs={12} sm={12}>
          <WalletOverviewAccountBalance account={account.address} />
        </GridCol>
      </GridRow>
    </Grid>
  );
};

export default WalletOverview;
