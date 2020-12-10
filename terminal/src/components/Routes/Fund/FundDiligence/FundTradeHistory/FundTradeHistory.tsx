import React from 'react';
import { Spinner } from '~/storybook/Spinner/Spinner';
import {
  ScrollableTable,
  Table,
  HeaderCell,
  HeaderRow,
  BodyCell,
  BodyRow,
  NoEntries,
  HeaderCellRightAlign,
  BodyCellRightAlign,
} from '~/storybook/Table/Table';
import { useFundTradeHistoryQuery } from './FundTradeHistory.query';
import { FormattedDate } from '~/components/Common/FormattedDate/FormattedDate';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { Block } from '~/storybook/Block/Block';

export interface FundTradeHistoryProps {
  address: string;
}

export const FundTradeHistory: React.FC<FundTradeHistoryProps> = ({ address }) => {
  const [trades, query] = useFundTradeHistoryQuery(address);

  return (
    <Block>
      {query.loading && <Spinner />}
      {!query.loading && !trades.length && <NoEntries>No entries.</NoEntries>}
      {!query.loading && trades.length > 0 && (
        <ScrollableTable>
          <Table>
            <thead>
              <HeaderRow>
                <HeaderCell>Time</HeaderCell>
                <HeaderCell>Exchange</HeaderCell>
                <HeaderCellRightAlign>Buy quantity</HeaderCellRightAlign>
                <HeaderCell>Buy asset</HeaderCell>
                <HeaderCellRightAlign>Sell quantity</HeaderCellRightAlign>
                <HeaderCell>Sell asset</HeaderCell>
                <HeaderCellRightAlign>Price</HeaderCellRightAlign>
                <HeaderCell>Type</HeaderCell>
              </HeaderRow>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <BodyRow key={trade.id}>
                  <BodyCell>
                    <FormattedDate timestamp={trade.timestamp} />
                  </BodyCell>
                  <BodyCell>{trade.exchange?.name}</BodyCell>
                  <BodyCellRightAlign>
                    {trade.buyQuantity && !trade.buyQuantity.isNaN() ? (
                      <FormattedNumber tooltip={true} value={trade.buyQuantity} />
                    ) : (
                      <></>
                    )}
                  </BodyCellRightAlign>
                  <BodyCell>{trade.buyAsset?.symbol}</BodyCell>
                  <BodyCellRightAlign>
                    {trade.sellQuantity && !trade.sellQuantity.isNaN() ? (
                      <FormattedNumber tooltip={true} value={trade.sellQuantity} />
                    ) : (
                      <></>
                    )}
                  </BodyCellRightAlign>
                  <BodyCell>{trade.sellAsset?.symbol}</BodyCell>
                  <BodyCellRightAlign>
                    {trade.price && !trade.price.isNaN() ? (
                      <FormattedNumber
                        tooltip={true}
                        value={trade.price}
                        decimals={4}
                        suffix={`${trade.sellAsset?.symbol}/${trade.buyAsset?.symbol}`}
                      />
                    ) : (
                      <></>
                    )}
                  </BodyCellRightAlign>
                  <BodyCell>{trade.methodName}</BodyCell>
                </BodyRow>
              ))}
            </tbody>
          </Table>
        </ScrollableTable>
      )}
    </Block>
  );
};
