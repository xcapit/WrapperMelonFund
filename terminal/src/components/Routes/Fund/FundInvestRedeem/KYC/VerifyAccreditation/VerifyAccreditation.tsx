import React, { useState } from 'react';
import { Button } from '~/components/Form/Button/Button';
import { SectionTitle } from '~/storybook/Title/Title';

export const VerifyAccreditation: React.FC = () => {
  const [state, setState] = useState('');
  const [error, setError] = useState('');

  const goToSynaps = async () => {
    try {
      const response = await fetch('https://synaps-service.avantgarde.finance/api/session');
      const json = await response.json();

      console.log(response, json);

      if (json.session_id) {
        window.open(`http://verify.synaps.io/?session_id=${json.session_id}&service=workflow`);
      }
    } catch (e) {
      setError('Unable to create Synaps Session ID.');
    }
  };

  return (
    <>
      <SectionTitle>
        Step 2: Verify your accreditation status
        {state && (
          <div>
            <a onClick={() => setState('US')}>US</a> <a onClick={() => setState('nonUS')}>non-US</a>
          </div>
        )}
      </SectionTitle>

      {error && <p>Error: {error}</p>}

      {!state && (
        <>
          <Button onClick={() => setState('US')}>I am a US-based investor</Button>
          <Button onClick={() => setState('nonUS')}>I am not a US-based investor</Button>
          <p>&nbsp;</p>
        </>
      )}
      {state === 'US' && (
        <>
          <p>Start your accreditation by clicking on the button below:</p>
          <Button onClick={() => window.open('https://verifyinvestor.com/preliminary?t=investor')}>
            Go to VerifyInvestor.com (US investor)
          </Button>
        </>
      )}
      {state === 'nonUS' && (
        <>
          <p>Start your accreditation by clicking on the button below:</p>
          <Button onClick={() => goToSynaps()}>Go to Synaps (non-US investor)</Button>
        </>
      )}
      <p>&nbsp;</p>

      <SectionTitle>Step 3: Submit the "Accreditation Certificate"</SectionTitle>
      <p>
        For US investors: once you you have received your accreditations certificate from VerifyInvestor.com please send
        the document by email to verify@avantgarde.finance.
      </p>
      <p>
        For non-US investors: once you have successfully completed the KYC/AML process please email
        verify@avantgarde.finance to let us know
      </p>

      <SectionTitle>Step 4: Confirmation</SectionTitle>
      <p>
        Once we have received all the necessary data, the fund manager will add you to the investor whitelist, and you
        can invest into the fund. We will inform you, once this is possible.
      </p>
    </>
  );
};
