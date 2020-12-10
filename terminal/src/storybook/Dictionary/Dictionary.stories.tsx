import React from 'react';
import { Grid, GridRow, GridCol } from '../Grid/Grid';
import { SectionTitle } from '../Title/Title';
import { Dictionary, DictionaryDivider, DictionaryEntry, DictionaryLabel, DictionaryData } from './Dictionary';

export default { title: 'Components|Dictionary' };

export const Default: React.FC = () => {
  return (
    <Dictionary>
      <DictionaryEntry>
        <DictionaryLabel>Label</DictionaryLabel>
        <DictionaryData>Data</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Label</DictionaryLabel>
        <DictionaryData>Data</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Label</DictionaryLabel>
        <DictionaryData>Data</DictionaryData>
      </DictionaryEntry>
      <DictionaryDivider />
      <DictionaryEntry>
        <DictionaryLabel>Label</DictionaryLabel>
        <DictionaryData>Data</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Label</DictionaryLabel>
        <DictionaryData>Data</DictionaryData>
      </DictionaryEntry>
    </Dictionary>
  );
};

export const WithContextAndData: React.FC = () => {
  return (
    <Grid>
      <GridRow>
        <GridCol xs={12} md={6}>
          <Dictionary>
            <SectionTitle>Fund factsheet</SectionTitle>
            <DictionaryDivider />
            <DictionaryEntry>
              <DictionaryLabel>Fund name</DictionaryLabel>
              <DictionaryData>My Second Melon Fund</DictionaryData>
            </DictionaryEntry>
            <DictionaryEntry>
              <DictionaryLabel>Protocol version</DictionaryLabel>
              <DictionaryData>1.0.5</DictionaryData>
            </DictionaryEntry>
            <DictionaryEntry>
              <DictionaryLabel>Fund address</DictionaryLabel>
              <DictionaryData>0xcf74a2f1778509fee75444da809</DictionaryData>
            </DictionaryEntry>
            <DictionaryEntry>
              <DictionaryLabel>Manager address</DictionaryLabel>
              <DictionaryData>0x56a2f1778509fee7547ca809</DictionaryData>
            </DictionaryEntry>
            <DictionaryEntry>
              <DictionaryLabel>Status</DictionaryLabel>
              <DictionaryData>Active</DictionaryData>
            </DictionaryEntry>
            <DictionaryDivider />
            <DictionaryEntry>
              <DictionaryLabel>Gross asset value</DictionaryLabel>
              <DictionaryData>0.0000 WETH</DictionaryData>
            </DictionaryEntry>
            <DictionaryEntry>
              <DictionaryLabel>Net asset value</DictionaryLabel>
              <DictionaryData>0.0000 WETH</DictionaryData>
            </DictionaryEntry>
            <DictionaryEntry>
              <DictionaryLabel>Number of shares</DictionaryLabel>
              <DictionaryData>0.0000 shares</DictionaryData>
            </DictionaryEntry>
            <DictionaryEntry>
              <DictionaryLabel>Share price</DictionaryLabel>
              <DictionaryData>1.87775 WETH</DictionaryData>
            </DictionaryEntry>
            <DictionaryDivider />
            <DictionaryEntry>
              <DictionaryLabel>Management fee</DictionaryLabel>
              <DictionaryData>2.00%</DictionaryData>
            </DictionaryEntry>
            <DictionaryEntry>
              <DictionaryLabel>Performence fee</DictionaryLabel>
              <DictionaryData>10.00%</DictionaryData>
            </DictionaryEntry>
            <DictionaryEntry>
              <DictionaryLabel>Performance fee period</DictionaryLabel>
              <DictionaryData>1 day</DictionaryData>
            </DictionaryEntry>
            <DictionaryEntry>
              <DictionaryLabel>Start of next performance period</DictionaryLabel>
              <DictionaryData>01/08/2020 12:24</DictionaryData>
            </DictionaryEntry>
            <DictionaryDivider />
            <DictionaryEntry>
              <DictionaryLabel>Return since inception</DictionaryLabel>
              <DictionaryData>0.0000 ETH</DictionaryData>
            </DictionaryEntry>
            <DictionaryEntry>
              <DictionaryLabel>Annualized return</DictionaryLabel>
              <DictionaryData>0.0000 ETH</DictionaryData>
            </DictionaryEntry>
            <DictionaryEntry>
              <DictionaryLabel>Annualized volatility</DictionaryLabel>
              <DictionaryData>62.54%</DictionaryData>
            </DictionaryEntry>
            <DictionaryDivider />
            <DictionaryEntry>
              <DictionaryLabel>Authorized exchanges</DictionaryLabel>
              <DictionaryData>Oasisdex, 0x (v2.0), Melon Engine</DictionaryData>
            </DictionaryEntry>
          </Dictionary>
        </GridCol>
      </GridRow>
    </Grid>
  );
};
