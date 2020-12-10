import React from 'react';
import { Table, HeaderRow, HeaderCell, BodyRow, BodyCell } from './Table';
export default { title: 'Components|Table' };

export const Deafult: React.FC = () => {
  return (
    <Table>
      <thead>
        <HeaderRow>
          <HeaderCell>Time</HeaderCell>
          <HeaderCell>Exchange</HeaderCell>
          <HeaderCell>Buy asset</HeaderCell>
          <HeaderCell>Sell asset</HeaderCell>
          <HeaderCell>Buy quantity</HeaderCell>
          <HeaderCell>Sell quantity</HeaderCell>
          <HeaderCell>Order type</HeaderCell>
        </HeaderRow>
      </thead>
      <tbody>
        <BodyRow>
          <BodyCell>Date</BodyCell>
          <BodyCell>exchange name</BodyCell>
          <BodyCell>buyAsset symbol</BodyCell>
          <BodyCell>sellAsset symbol</BodyCell>
          <BodyCell>buyQuantity</BodyCell>
          <BodyCell>sellQuantity</BodyCell>
          <BodyCell>signature label</BodyCell>
        </BodyRow>
        <BodyRow>
          <BodyCell>Date</BodyCell>
          <BodyCell>exchange name</BodyCell>
          <BodyCell>buyAsset symbol</BodyCell>
          <BodyCell>sellAsset symbol</BodyCell>
          <BodyCell>buyQuantity</BodyCell>
          <BodyCell>sellQuantity</BodyCell>
          <BodyCell>signature label</BodyCell>
        </BodyRow>
      </tbody>
    </Table>
  );
};
