import React from 'react';
import { Grid, GridCol, GridRow } from '~/storybook/Grid/Grid';
import { Container } from '~/storybook/Container/Container';
import { FundLeaderboard } from '~/components/Routes/Home/FundLeaderboard/FundLeaderboard';
import { FundMetrics } from '~/components/Routes/Home/FundMetrics/FundMetrics';
import { FundOverview } from '~/components/Routes/Home/FundOverview/FundOverview';

export const Home: React.FC = () => {
  return (
    <Container>
      <Grid>
        <GridRow>
          <GridCol xs={12} sm={6}>
            <FundMetrics />
          </GridCol>
          <GridCol xs={12} sm={6}>
            <FundLeaderboard />
          </GridCol>
        </GridRow>
        <GridRow>
          <GridCol xs={12} sm={12}>
            <FundOverview />
          </GridCol>
        </GridRow>
      </Grid>
    </Container>
  );
};

export default Home;
