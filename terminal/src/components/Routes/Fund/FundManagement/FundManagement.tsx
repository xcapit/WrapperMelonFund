import React from 'react';
import { Grid, GridRow, GridCol } from '~/storybook/Grid/Grid';
import FundClaimFees from './FundClaimFees/FundClaimFees';
import FundShutdown from './FundShutdown/FundShutdown';
import FundReturnBatchToVault from './FundReturnBatchToVault/FundReturnBatchToVault';
import { FundTelegramAccess } from './FundTelegramAccess/FundTelegramAccess';
import FundIvestmentAssets from './FundInvestmentAssets/FundInvestmentAssets';
import { FundExchanges } from '~/components/Routes/Fund/FundManagement/FundExchanges/FundExchanges';
import { RequiresFundNotShutDown } from '~/components/Gates/RequiresFundNotShutDown/RequiresFundNotShutDown';
import { RequiresFundManager } from '~/components/Gates/RequiresFundManager/RequiresFundManager';
import { RequiresFundDeployedWithCurrentVersion } from '~/components/Gates/RequiresFundDeployedWithCurrentVersion/RequiresFundDeployedWithCurrentVersion';

export interface FundManagementProps {
  address: string;
}

export const FundManagement: React.FC<FundManagementProps> = ({ address }) => (
  <RequiresFundManager>
    <Grid>
      <RequiresFundDeployedWithCurrentVersion address={address} fallback={false}>
        <RequiresFundNotShutDown fallback={false}>
          <GridRow>
            <GridCol xs={12} sm={6}>
              <FundIvestmentAssets address={address} />
            </GridCol>
            <GridCol xs={12} sm={6}>
              <FundExchanges address={address} />
            </GridCol>
          </GridRow>
        </RequiresFundNotShutDown>
      </RequiresFundDeployedWithCurrentVersion>
      <GridRow>
        <GridCol xs={12} sm={6}>
          <FundClaimFees address={address} />
        </GridCol>
        <RequiresFundNotShutDown fallback={false}>
          <GridCol xs={12} sm={6}>
            <FundShutdown address={address} />
          </GridCol>
        </RequiresFundNotShutDown>
      </GridRow>

      <GridRow>
        <FundReturnBatchToVault address={address} />
        <RequiresFundNotShutDown fallback={false}>
          <GridCol xs={12} sm={6}>
            <FundTelegramAccess />
          </GridCol>
        </RequiresFundNotShutDown>
      </GridRow>
    </Grid>
  </RequiresFundManager>
);

export default FundManagement;
