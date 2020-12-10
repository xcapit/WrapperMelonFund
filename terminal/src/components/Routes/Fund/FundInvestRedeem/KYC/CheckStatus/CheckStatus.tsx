import React, { useState } from 'react';
import * as Yup from 'yup';
import { Button } from '~/components/Form/Button/Button';
import { Form, useFormik } from '~/components/Form/Form';
import { Input } from '~/components/Form/Input/Input';
import { useAccount } from '~/hooks/useAccount';
import { useConnectionState } from '~/hooks/useConnectionState';
import { useEnvironment } from '~/hooks/useEnvironment';
import { BlockActions } from '~/storybook/Block/Block';
import { NotificationBar, NotificationContent } from '~/storybook/NotificationBar/NotificationBar';
import { SectionTitle } from '~/storybook/Title/Title';

interface CheckStatsProps {
  address: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string().required('This is a required field.'),
});

const initialValues = {
  email: '',
};

export const CheckStatus: React.FC<CheckStatsProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const connection = useConnectionState();
  const account = useAccount();

  const [submissionState, setSubmissionState] = useState('initial');
  const [error, setError] = useState('');

  const [status, setStatus] = useState<any>();

  const formik = useFormik({
    validationSchema,
    initialValues,
    onSubmit: async (values) => {
      setSubmissionState('waitForSignature');

      const email = values.email;

      const user = {
        email,
      };

      try {
        const signature =
          connection.method === 'ganache'
            ? await environment?.client.sign(email, account.address!)
            : await environment?.client.personal.sign(email, account.address!, 'password');

        setSubmissionState('waitForConfirmation');

        const result = await (
          await fetch(`${process.env.MELON_KYC_VERIFY_EMAIL_API}/api/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...user, signature, wallet: account.address! }),
          })
        ).json();

        setStatus(result.data);

        setSubmissionState('confirmationReceived');
      } catch (e) {
        setError(e.message);
        setSubmissionState('initial');
      }
    },
  });

  return (
    <>
      <SectionTitle>Check your status</SectionTitle>

      <Form formik={formik}>
        {submissionState === 'confirmationReceived' && (
          <>
            <p>
              Your status:
              <br />
              {status?.found ? (
                <NotificationBar kind="success">
                  <NotificationContent>
                    Email: {status?.details?.email}
                    <br />
                    Wallets: {status?.details?.wallets.join(', ')}
                    <br />
                    Email verified: {status?.details?.emailVerified ? 'Yes' : 'No'}
                    <br />
                    Accreditation verified: {status?.details?.accreditationVerified ? 'Yes' : 'No'}
                  </NotificationContent>
                </NotificationBar>
              ) : (
                <NotificationBar kind="error">
                  <NotificationContent>
                    This wallet/email combination was not found. Please start the process above.
                  </NotificationContent>
                </NotificationBar>
              )}
            </p>
          </>
        )}
        {(submissionState === 'initial' || submissionState === 'confirmationReceived') && (
          <>
            <p>For security reasons, please enter your email address below.</p>
            <Input name="email" label="Email address" />
            {error && (
              <>
                <p>There was an error: {error} Please try again.</p>
              </>
            )}
            <BlockActions>
              <Button type="submit">Check Status</Button>
            </BlockActions>
          </>
        )}

        {submissionState === 'waitForSignature' && (
          <>
            <p>Please sign the message with your wallet.</p>
          </>
        )}

        {submissionState === 'waitForConfirmation' && (
          <>
            <p>Submitting information...</p>
          </>
        )}
      </Form>
    </>
  );
};
