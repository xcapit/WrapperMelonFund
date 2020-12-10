import React from 'react';
import { Grid, GridRow, GridCol } from '~/storybook/Grid/Grid';
import { FundRegisterPolicies } from './FundRegisterPolicies/FundRegisterPolicies';
import { FundPolicies } from '../FundDiligence/FundPolicies/FundPolicies';
import { RequiresFundDeployedWithCurrentVersion } from '~/components/Gates/RequiresFundDeployedWithCurrentVersion/RequiresFundDeployedWithCurrentVersion';
import { RequiresFundManager } from '~/components/Gates/RequiresFundManager/RequiresFundManager';

export interface FundRiskProfileProps {
  address: string;
}

export const FundRiskProfile: React.FC<FundRiskProfileProps> = ({ address }) => (
  <RequiresFundManager>
    <Grid>
      <GridRow>
        <RequiresFundDeployedWithCurrentVersion address={address} fallback={false}>
          <GridCol xs={12} sm={12}>
            <FundRegisterPolicies address={address} />
          </GridCol>
        </RequiresFundDeployedWithCurrentVersion>
      </GridRow>
      <GridRow>
        <GridCol>
          <FundPolicies address={address} />
        </GridCol>
      </GridRow>
    </Grid>
  </RequiresFundManager>
);

export default FundRiskProfile;
