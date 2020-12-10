import React from 'react';
import * as Yup from 'yup';
import { BigNumber } from 'bignumber.js';
import { MaxConcentration, Deployment, PolicyDefinition } from '@melonproject/melonjs';
import { MaxConcentrationBytecode } from '@melonproject/melonjs/abis/MaxConcentration.bin';
import { Form, useFormik } from '~/components/Form/Form';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccount } from '~/hooks/useAccount';
import { SectionTitle } from '~/storybook/Title/Title';
import { BlockActions } from '~/storybook/Block/Block';
import { NotificationBar, NotificationContent } from '~/storybook/NotificationBar/NotificationBar';
import { Input } from '~/components/Form/Input/Input';
import { Button } from '~/components/Form/Button/Button';
import { FundPolicy, MaxConcentrationPolicy } from '../../FundDiligence/FundPolicies/FundPolicies.query';

const validationSchema = Yup.object().shape({
  maxConcentration: Yup.number().label('Maximum concentration (%)').required().min(0).max(100),
});

const initialValues = {
  maxConcentration: 25,
};

export interface MaxConcentrationConfigurationProps {
  policyManager: string;
  policy: PolicyDefinition;
  allPolicies?: FundPolicy[];
  startTransaction: (tx: Deployment<MaxConcentration>, name: string) => void;
}

export const MaxConcentrationConfiguration: React.FC<MaxConcentrationConfigurationProps> = (props) => {
  const environment = useEnvironment()!;
  const account = useAccount();

  const preExistingPolicy = props.allPolicies?.find((policy) => policy.identifier === 'MaxConcentration') as
    | MaxConcentrationPolicy
    | undefined;

  const formik = useFormik({
    validationSchema,
    initialValues,
    onSubmit: async (data) => {
      const tx = MaxConcentration.deploy(
        environment,
        MaxConcentrationBytecode,
        account.address!,
        new BigNumber(data.maxConcentration!).multipliedBy('1e16')
      );
      props.startTransaction(tx, 'Deploy MaxConcentration Contract');
    },
  });

  if (preExistingPolicy) {
    return (
      <>
        <SectionTitle>Configure Maximum Concentration Policy</SectionTitle>
        <NotificationBar kind="neutral">
          <NotificationContent>
            You have already deployed a maximum concentration policy. You cannot deploy a second maximum concentration
            policy.
          </NotificationContent>
        </NotificationBar>
      </>
    );
  }

  return (
    <>
      <SectionTitle>Configure Maximum Concentration Policy</SectionTitle>
      <NotificationBar kind="neutral">
        <NotificationContent>
          The maximum concentration policy imposes a maximum concentration for each asset in the portfolio (except for
          the denomination asset). E.g. a maximum concentration of 33% means that a single asset in the portfolio can
          make up at most 33% of the fund's total asset value.
        </NotificationContent>
      </NotificationBar>
      <NotificationBar kind="error">
        <NotificationContent>
          Deploying a maximum concentration policy cannot be undone. Once you have deployed a maximum concentration
          policy, you will not be able to change the parameters of the policy. <br />
          <br />
          Policies protect investors, but they can also make your fund un-usable if they are too stringent.
        </NotificationContent>
      </NotificationBar>
      <Form formik={formik}>
        <Input name="maxConcentration" label="Maximum concentration (%)" type="number" step="any" />

        <BlockActions>
          <Button type="submit">Add Max Concentration Policy</Button>
        </BlockActions>
      </Form>
    </>
  );
};

export default MaxConcentrationConfiguration;
