import React from 'react';
import { PriceTolerancePolicy } from './FundPolicies.query';
import { BodyCell } from '~/storybook/Table/Table';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import BigNumber from 'bignumber.js';

interface PriceToleranceProps {
  policy: PriceTolerancePolicy;
}

export const PriceTolerance: React.FC<PriceToleranceProps> = ({ policy }) => {
  return (
    <BodyCell>
      <FormattedNumber
        value={new BigNumber(policy.priceTolerance).dividedBy('1e18').multipliedBy(100)}
        decimals={0}
        suffix="%"
      />
    </BodyCell>
  );
};
