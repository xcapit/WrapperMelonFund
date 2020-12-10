import React from 'react';
import { usePriceFeedUpdateQuery } from '~/components/Layout/PriceFeedUpdate.query';
import { useFund } from '~/hooks/useFund';
import { Grid, GridCol, GridRow } from '~/storybook/Grid/Grid';
import { NotificationBar, NotificationContent } from '~/storybook/NotificationBar/NotificationBar';
import { FundDiligence } from '../FundDiligence/FundDiligence';
import { FundHoldings } from '../FundHoldings/FundHoldings';
import { NewFundPerformanceChart } from '../FundPerformanceChart/FundPerformanceChart';
import { FundMonthlyReturnTable } from '../FundPerformanceMetrics/FundMonthlyReturnTable';
import { FundSharePriceMetrics } from '../FundPerformanceMetrics/FundSharePriceMetrics';

export interface FundOverviewProps {
  address: string;
}

export const FundOverview: React.FC<FundOverviewProps> = ({ address }) => {
  const [update] = usePriceFeedUpdateQuery();
  const fund = useFund();

  const showMetrics = React.useMemo(() => {
    if (update && fund.creationTime) {
      return update.getTime() > fund.creationTime.getTime();
    }

    return false;
  }, [fund.creationTime, update]);
  const showMetricsNotification = !!(!showMetrics && update && fund.creationTime);

  return (
    <Grid>
      {showMetrics && (
        <>
          <GridRow>
            <GridCol sm={12} md={8} lg={8}>
              <NewFundPerformanceChart address={address} />
            </GridCol>
            <GridCol sm={12} md={4} lg={4}>
              <FundSharePriceMetrics address={address} />
            </GridCol>
          </GridRow>
          <GridRow>
            <GridCol>
              <FundMonthlyReturnTable address={address} />
            </GridCol>
          </GridRow>
        </>
      )}
      {showMetricsNotification && (
        <NotificationBar>
          <NotificationContent>
            The fund metrics for this fund will become available after the next price feed update.
          </NotificationContent>
        </NotificationBar>
      )}
      <GridRow>
        <GridCol>
          <FundHoldings address={address} />
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol>
          <FundDiligence address={address} />
        </GridCol>
      </GridRow>
    </Grid>
  );
};

export default FundOverview;
