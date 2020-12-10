import React from 'react';
import * as Yup from 'yup';
import { MaxPositions, Deployment, PolicyDefinition } from '@melonproject/melonjs';
import { MaxPositionsBytecode } from '@melonproject/melonjs/abis/MaxPositions.bin';
import { Form, useFormik } from '~/components/Form/Form';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccount } from '~/hooks/useAccount';
import { Button } from '~/components/Form/Button/Button';
import { Input } from '~/components/Form/Input/Input';
import { SectionTitle } from '~/storybook/Title/Title';
import { BlockActions } from '~/storybook/Block/Block';
import { NotificationBar, NotificationContent } from '~/storybook/NotificationBar/NotificationBar';
import { FundPolicy, MaxPositionsPolicy } from '../../FundDiligence/FundPolicies/FundPolicies.query';

const validationSchema = Yup.object().shape({
  maxPositions: Yup.number().label('Maximum positions').required().min(0).integer(),
});

const initialValues = {
  maxPositions: 20,
};

export interface MaxPositionsConfigurationProps {
  policyManager: string;
  policy: PolicyDefinition;
  allPolicies?: FundPolicy[];
  startTransaction: (tx: Deployment<MaxPositions>, name: string) => void;
}

export const MaxPositionsConfiguration: React.FC<MaxPositionsConfigurationProps> = (props) => {
  const environment = useEnvironment()!;
  const account = useAccount();

  const preExistingPolicy = props.allPolicies?.find((policy) => policy.identifier === 'MaxPositions') as
    | MaxPositionsPolicy
    | undefined;

  const formik = useFormik({
    validationSchema,
    initialValues,
    onSubmit: async (data) => {
      const tx = MaxPositions.deploy(environment, MaxPositionsBytecode, account.address!, data.maxPositions!);
      props.startTransaction(tx, 'Deploy MaxPositions Contract');
    },
  });

  if (preExistingPolicy) {
    return (
      <>
        <SectionTitle>Configure Maximum Number of Positions Policy</SectionTitle>
        <NotificationBar kind="neutral">
          <NotificationContent>
            You have already deployed a maximum number of positions policy. You cannot deploy a second maximum number of
            positions policy.
          </NotificationContent>
        </NotificationBar>
      </>
    );
  }

  return (
    <>
      <SectionTitle>Configure Maximum Number of Positions Policy</SectionTitle>
      <NotificationBar kind="neutral">
        <NotificationContent>
          The maximum number of positions policy imposes a maximum on the number of assets that a fund can hold.
        </NotificationContent>
      </NotificationBar>
      <NotificationBar kind="error">
        <NotificationContent>
          Deploying a maximum number of positions policy cannot be undone. Once you have deployed a maximum number of
          positions policy, you will not be able to change the parameters of the policy. <br />
          <br />
          Policies protect investors, but they can also make your fund un-usable if they are too stringent.
        </NotificationContent>
      </NotificationBar>
      <Form formik={formik}>
        <Input name="maxPositions" label="Maximum number of positions" type="number" step={1} />
        <BlockActions>
          <Button type="submit">Add Max Positions Policy</Button>
        </BlockActions>
      </Form>
    </>
  );
};

export default MaxPositionsConfiguration;
