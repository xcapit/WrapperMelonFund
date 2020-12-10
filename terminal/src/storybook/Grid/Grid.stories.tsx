import React from 'react';
import { Grid, GridRow, GridCol } from './Grid';
import { Block } from '../Block/Block';

export default { title: 'Layouts|Grid' };

export const Default: React.FC = () => {
  return (
    <Grid>
      <GridRow>
        <GridCol xs={12} sm={6} md={4} lg={4}>
          <Block>
            3 Small columns, stacked on xs-screens
            <br />
            <hr />
            xs={12} sm={12} md={4} lg={4}
          </Block>
        </GridCol>
        <GridCol xs={12} sm={6} md={4} lg={4}>
          <Block>
            3 Small columns, stacked on xs-screens
            <br />
            <hr />
            xs={12} sm={12} md={4} lg={4}
          </Block>
        </GridCol>
        <GridCol xs={12} sm={6} md={4} lg={4}>
          <Block>
            3 Small columns, stacked on xs-screens
            <br />
            <hr />
            xs={12} sm={12} md={4} lg={4}
          </Block>
        </GridCol>
      </GridRow>
    </Grid>
  );
};

export const TwoColumns: React.FC = () => {
  return (
    <Grid>
      <GridRow>
        <GridCol xs={12} sm={6}>
          <Block>
            Two columns, stacked on xs-screens
            <br />
            <hr />
            xs={12} sm={6}
          </Block>
        </GridCol>
        <GridCol xs={12} sm={6}>
          <Block>
            Two columns, stacked on xs-screens
            <br />
            <hr />
            xs={12} sm={6}
          </Block>
        </GridCol>
      </GridRow>
    </Grid>
  );
};

export const StandaloneSmall: React.FC = () => {
  return (
    <Grid>
      <GridRow justify="center">
        <GridCol xs={12} sm={6} md={4} lg={4}>
          <Block>
            Stand-alone form with small fields
            <hr />
            xs={12} sm={6} md={4} lg={4}
          </Block>
        </GridCol>
      </GridRow>
    </Grid>
  );
};

export const StandaloneMedium: React.FC = () => {
  return (
    <Grid>
      <GridRow justify="center">
        <GridCol xs={12} sm={10} md={8} lg={6}>
          <Block>
            Stand-alone block long form fields/text
            <hr />
            xs={12} sm={10} md={8} lg={6}
          </Block>
        </GridCol>
      </GridRow>
    </Grid>
  );
};

export const FundLayout: React.FC = () => {
  return (
    <Grid>
      <GridRow>
        <GridCol xs={12} sm={6} md={3}>
          <Block>
            <h2>Holdings</h2> Top-Left Fund section <hr /> xs={12} sm={6} md={3}
          </Block>
        </GridCol>
        <GridCol xs={12} sm={6} md={6}>
          <Block>
            <h2>Order Books</h2>Top-Center Fund Section <hr /> xs={12} sm={6} md={6}
          </Block>
        </GridCol>
        <GridCol xs={12} sm={12} md={3}>
          <Block>
            <h2>Trades</h2>Top-Right fund section
            <hr />
            xs={12} sm={6} md={3}{' '}
          </Block>
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol xs={12} sm={6} md={3}>
          <Block>
            <h2>Policies</h2>Bottom-Left fund section
            <hr />
            xs={12} sm={6} md={3}
          </Block>
        </GridCol>
        <GridCol xs={12} sm={6} md={3}>
          <Block>
            <h2>Open Orders</h2>Bottom-CenterLeft fund section
            <hr />
            xs={12} sm={6} md={3}
          </Block>
        </GridCol>
        <GridCol xs={12} sm={6} md={6}>
          <Block>
            <h2>Trading History</h2>Bottom-CenterRight fund section
            <hr />
            xs={12} sm={6} md={6}
          </Block>
        </GridCol>
      </GridRow>
    </Grid>
  );
};

export const WithoutBlocks: React.FC = () => {
  return (
    <Grid>
      <GridRow>
        <GridCol xs={12}>
          <div>
            Stand-alone grid full
            <hr />
            xs={12}
          </div>
        </GridCol>
      </GridRow>
    </Grid>
  );
};
