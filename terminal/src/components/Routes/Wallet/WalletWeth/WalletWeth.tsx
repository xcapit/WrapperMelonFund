import React from 'react';
import WalletWrapEther from './WalletWrapEther/WalletWrapEther';
import WalletUnwrapEther from './WalletUnwrapEther/WalletUnwrapEther';
import { Grid, GridRow, GridCol } from '~/storybook/Grid/Grid';
import { NotificationBar, NotificationContent } from '~/storybook/NotificationBar/NotificationBar';

const WalletWeth: React.FC = () => {
  return (
    <>
      <NotificationBar kind="neutral">
        <NotificationContent>
          The process of wrapping your Ether will get you{' '}
          <a href="https://weth.io/" target="blank">
            WETH
          </a>{' '}
          (Wrapped Ether) that you can then use to invest in a fund. Funds only accept investments in ERC20 tokens, so
          Ether needs to be wrapped to be invested in a fund.
        </NotificationContent>
      </NotificationBar>
      <Grid>
        <GridRow>
          <GridCol xs={12} sm={6}>
            <WalletWrapEther />
          </GridCol>
          <GridCol xs={12} sm={6}>
            <WalletUnwrapEther />
          </GridCol>
        </GridRow>
      </Grid>
    </>
  );
};

export default WalletWeth;
