import React from 'react';
import { Spinner } from '~/storybook/Spinner/Spinner';
import { useFundInvestments } from '~/components/Routes/Fund/FundInvestRedeem/FundInvestorsList/FundInvestments.query';
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
import { Block } from '~/storybook/Block/Block';
import { SectionTitle } from '~/storybook/Title/Title';
import { EtherscanLink } from '~/components/Common/EtherscanLink/EtherscanLink';
import { TokenValueDisplay } from '~/components/Common/TokenValueDisplay/TokenValueDisplay';

export interface FundInvestorsListProps {
  address: string;
}

export const FundInvestorsList: React.FC<FundInvestorsListProps> = ({ address }) => {
  const [fundInvestements, investementQuery] = useFundInvestments(address);

  if (investementQuery.loading) {
    return (
      <Block>
        <SectionTitle>Investors</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  if (!fundInvestements || !fundInvestements.length) {
    return (
      <Block>
        <SectionTitle>Investors</SectionTitle>
        <NoEntries>No entries.</NoEntries>
      </Block>
    );
  }

  return (
    <Block>
      <SectionTitle>Investors</SectionTitle>
      <ScrollableTable>
        <Table>
          <thead>
            <HeaderRow>
              <HeaderCell>Investor</HeaderCell>
              <HeaderCellRightAlign>Shares</HeaderCellRightAlign>
            </HeaderRow>
          </thead>
          <tbody>
            {fundInvestements.map((investement) => (
              <BodyRow key={investement.id}>
                <BodyCell>
                  <EtherscanLink address={investement.owner.id}>{investement.owner.id}</EtherscanLink>
                </BodyCell>
                <BodyCellRightAlign>
                  <TokenValueDisplay value={investement.shares} />
                </BodyCellRightAlign>
              </BodyRow>
            ))}
          </tbody>
        </Table>
      </ScrollableTable>
    </Block>
  );
};
