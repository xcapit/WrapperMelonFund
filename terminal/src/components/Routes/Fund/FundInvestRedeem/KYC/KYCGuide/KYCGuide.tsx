import React from 'react';
import { Block } from '~/storybook/Block/Block';
import { Container } from '~/storybook/Container/Container';
import { Grid, GridCol, GridRow } from '~/storybook/Grid/Grid';
import { SectionTitle, Title } from '~/storybook/Title/Title';

export const KYCGuide: React.FC = () => {
  return (
    <Container>
      <Grid>
        <GridRow>
          <GridCol>
            <Block>
              <SectionTitle>Investor verification guide</SectionTitle>
              <p>For regulatory reasons, some funds require investors to be accredited.</p>
              <p>In order to verify that you are an accredited investor, please follow the following steps:</p>

              <Title>Step 1: Verify your email and wallet address.</Title>
              <p>
                We have to verify that both your email address and your wallet address are controlled by you. In order
                to do this, you are using your wallet to sign a message containing your email address. You will receive
                an email with a link that you have to click to confirm your email address.
              </p>

              <Title>Step 2: Verify your investor accreditation.</Title>
              <p>
                For US-investors, the investor accreditation check is carried out in a secure and confidential way by{' '}
                <a href="https://verifyinvestor.com/">VerifyInvestor.com</a>. Once the accreditation check is completed,
                you will receive a "Verification Certificate" from{' '}
                <a href="https://verifyinvestor.com/">VerifyInvestor.com</a>. The costs of the accreditation check are
                USD 69.-
              </p>

              <p>
                For non-US investors, the investor verification check is carried out in a secure and confidential way by{' '}
                <a href="https://synaps.ios/">Synaps</a>.
              </p>

              <p>
                When you submit data to either VerifyInvestor.com or to Synaps, please make sure to use the same email
                address that you had verified in the first step.
              </p>

              <Title>Step 3: Submit the "Accreditation Certificate".</Title>
              <p>
                For US investors: once you you have received your accreditations certificate from VerifyInvestor.com
                please send the document by email to verify@avantgarde.finance.
              </p>
              <p>
                For non-US investos: once you have successfully completed the KYC/AML process please email
                verify@avantgarde.finance to let us know.
              </p>

              <Title>Step 4: Receive confirmation.</Title>
              <p>
                Once we have received all the necessary data, the fund manager will add you to the investor whitelist,
                and you can invest into the fund. We will inform you, once this is possible.
              </p>
            </Block>
          </GridCol>
        </GridRow>
      </Grid>
    </Container>
  );
};
