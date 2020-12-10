import React from 'react';
import { MaxPositionsPolicy } from './FundPolicies.query';
import { BodyCell } from '~/storybook/Table/Table';

interface MaxPositionsProps {
  policy: MaxPositionsPolicy;
}

export const MaxPositions: React.FC<MaxPositionsProps> = ({ policy }) => {
  return <BodyCell>{policy.maxPositions}</BodyCell>;
};
