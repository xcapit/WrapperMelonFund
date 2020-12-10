import React from 'react';
import * as Yup from 'yup';
import { Block } from '~/storybook/Block/Block';
import { SectionTitle } from '~/storybook/Title/Title';
import { VerifyEmail } from './VerifyEmail/VerifyEmail';
import { VerifyAccreditation } from './VerifyAccreditation/VerifyAccreditation';
import { Link } from '~/storybook/Link/Link';
import { CheckStatus } from './CheckStatus/CheckStatus';

interface KYCProps {
  address: string;
}

export const KYC: React.FC<KYCProps> = ({ address }) => {
  return (
    <Block>
      <SectionTitle>Investor verification</SectionTitle>
      <p>
        You can only invest into this fund as an accredited investor. Please follow the steps below to start the
        process.
      </p>
      <p>
        You can find a detailed description about the whole process in our{' '}
        <Link to={'/kyc-guide'} target="_blank">
          KYC guide
        </Link>
        .
      </p>
      <VerifyEmail address={address} />
      <br />
      <br />
      <VerifyAccreditation />
      <br />
      <br />
      <CheckStatus address={address} />
    </Block>
  );
};
