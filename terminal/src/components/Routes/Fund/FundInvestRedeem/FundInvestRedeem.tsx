import React from 'react';
import { Fallback } from '~/components/Common/Fallback/Fallback';
import { RequiresAccount } from '~/components/Gates/RequiresAccount/RequiresAccount';
import { Grid, GridCol, GridRow } from '~/storybook/Grid/Grid';
import { FundInvest } from './FundInvest/FundInvest';
import { FundRedeem } from './FundRedeem/FundRedeem';

export interface FundInvestProps {
  address: string;
}

export const FundInvestRedeem: React.FC<FundInvestProps> = ({ address }) => {
  const fallback = (
    <Fallback kind="error">You must be logged in with a connection provider to invest in a fund.</Fallback>
  );
  return (
    <Grid>
      <RequiresAccount fallback={fallback}>
        <GridRow>
          <GridCol xs={12} sm={6}>
            <FundInvest address={address} />
          </GridCol>
          <GridCol xs={12} sm={6}>
            <FundRedeem address={address} />
          </GridCol>
        </GridRow>
      </RequiresAccount>
    </Grid>
  );
};

export default FundInvestRedeem;
