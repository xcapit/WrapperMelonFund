import React from 'react';
import { Spinner } from '~/storybook/Spinner/Spinner';
import { useFundInvestmentHistory } from '~/components/Routes/Fund/FundInvestRedeem/FundInvestmentHistoryList/FundTradingInvestmentsHistory.query';
import {
  ScrollableTable,
  Table,
  HeaderCell,
  HeaderCellRightAlign,
  HeaderRow,
  BodyCell,
  BodyCellRightAlign,
  BodyRow,
  NoEntries,
} from '~/storybook/Table/Table';
import { FormattedDate } from '~/components/Common/FormattedDate/FormattedDate';
import { EtherscanLink } from '~/components/Common/EtherscanLink/EtherscanLink';
import { TokenValueDisplay } from '~/components/Common/TokenValueDisplay/TokenValueDisplay';
import { Block } from '~/storybook/Block/Block';

export interface FundInvestmentHistoryProps {
  address: string;
}

export const FundInvestmentHistory: React.FC<FundInvestmentHistoryProps> = ({ address }) => {
  const [fundInvestment, fundInvestmentQuery] = useFundInvestmentHistory(address);

  if (fundInvestmentQuery.loading) {
    return (
      <>
        <Spinner />
      </>
    );
  }

  if (!fundInvestment || !fundInvestment.length) {
    return (
      <Block>
        <NoEntries>No entries.</NoEntries>
      </Block>
    );
  }

  return (
    <Block>
      <ScrollableTable>
        <Table>
          <thead>
            <HeaderRow>
              <HeaderCell>Time</HeaderCell>
              <HeaderCell>Investor</HeaderCell>
              <HeaderCell>Action</HeaderCell>
              <HeaderCellRightAlign>Number of shares</HeaderCellRightAlign>
              <HeaderCellRightAlign>Share price</HeaderCellRightAlign>
              <HeaderCellRightAlign>Amount</HeaderCellRightAlign>
              <HeaderCell>Asset</HeaderCell>
              <HeaderCellRightAlign>Value in ETH</HeaderCellRightAlign>
            </HeaderRow>
          </thead>
          <tbody>
            {fundInvestment.map((investment) => {
              return (
                <BodyRow key={investment.id}>
                  <BodyCell>
                    <FormattedDate timestamp={investment.timestamp} />
                  </BodyCell>
                  <BodyCell>
                    <EtherscanLink address={investment.owner.id}>{investment.owner.id.substr(0, 8)}...</EtherscanLink>
                  </BodyCell>
                  <BodyCell>{investment.action}</BodyCell>
                  <BodyCellRightAlign>
                    <TokenValueDisplay value={investment.shares} />
                  </BodyCellRightAlign>
                  <BodyCellRightAlign>
                    <TokenValueDisplay value={investment.sharePrice} />
                  </BodyCellRightAlign>
                  <BodyCellRightAlign>
                    {investment.action === 'Investment' && (
                      <TokenValueDisplay value={investment.amount} decimals={investment.asset.decimals} />
                    )}
                  </BodyCellRightAlign>
                  <BodyCell>{investment.action === 'Investment' ? investment.asset.symbol : '(in kind)'}</BodyCell>
                  <BodyCellRightAlign>
                    <TokenValueDisplay value={investment.amountInDenominationAsset} />
                  </BodyCellRightAlign>
                </BodyRow>
              );
            })}
          </tbody>
        </Table>
      </ScrollableTable>
    </Block>
  );
};
