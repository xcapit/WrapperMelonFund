import React, { useState } from 'react';
import * as Yup from 'yup';
import { Button } from '~/components/Form/Button/Button';
import { Form, useFormik } from '~/components/Form/Form';
import { Input } from '~/components/Form/Input/Input';
import { useAccount } from '~/hooks/useAccount';
import { useConnectionState } from '~/hooks/useConnectionState';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useFund } from '~/hooks/useFund';
import { BlockActions } from '~/storybook/Block/Block';
import { SectionTitle } from '~/storybook/Title/Title';

interface VerifyEmailProps {
  address: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string().required('This is a required field.'),
});

const initialValues = {
  email: '',
};

export const VerifyEmail: React.FC<VerifyEmailProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const connection = useConnectionState();
  const account = useAccount();
  const fund = useFund();

  const [submissionState, setSubmissionState] = useState('initial');
  const [error, setError] = useState('');

  const formik = useFormik({
    validationSchema,
    initialValues,
    onSubmit: async (values) => {
      setSubmissionState('waitForSignature');

      const email = values.email;

      const user = {
        email,
        fund: address,
        fundName: fund.name,
      };

      try {
        const signature =
          connection.method === 'ganache'
            ? await environment?.client.sign(email, account.address!)
            : await environment?.client.personal.sign(email, account.address!, 'password');

        setSubmissionState('waitForConfirmation');

        const result = await (
          await fetch(`${process.env.MELON_KYC_VERIFY_EMAIL_API}/api/signature`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...user, signature, wallet: account.address! }),
          })
        ).json();

        setSubmissionState('confirmationReceived');
      } catch (e) {
        setError(e.message);
        setSubmissionState('initial');
      }
    },
  });

  return (
    <>
      <SectionTitle>Step 1: Verify your email address and your wallet</SectionTitle>

      <Form formik={formik}>
        {submissionState === 'initial' && (
          <>
            <Input name="email" label="Email address" />
            {error && (
              <>
                <p>There was an error: {error} Please try again.</p>
              </>
            )}
            <BlockActions>
              <Button type="submit">Verify Email Address</Button>
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

        {submissionState === 'confirmationReceived' && (
          <>
            <p>Submission successful.</p>
            <p>Please check your email to finish the verification process.</p>
            <p>
              <a
                onClick={() => {
                  setSubmissionState('initial');
                }}
              >
                Start over...
              </a>
            </p>
          </>
        )}
      </Form>
    </>
  );
};
