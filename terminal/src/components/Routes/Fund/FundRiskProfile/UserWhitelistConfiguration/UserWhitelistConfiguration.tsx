import React from 'react';
import * as Yup from 'yup';
import { TransactionReceipt } from 'web3-core';
import { isAddress } from 'web3-utils';
import { UserWhitelistBytecode } from '@melonproject/melonjs/abis/UserWhitelist.bin';
import {
  Deployment,
  UserWhitelist,
  PolicyDefinition,
  zeroAddress,
  Transaction,
  DeployedEnvironment,
} from '@melonproject/melonjs';
import { Form, useFormik } from '~/components/Form/Form';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccount } from '~/hooks/useAccount';
import { SectionTitle } from '~/storybook/Title/Title';
import { BlockActions } from '~/storybook/Block/Block';
import { NotificationBar, NotificationContent } from '~/storybook/NotificationBar/NotificationBar';
import { FundPolicy } from '../../FundDiligence/FundPolicies/FundPolicies.query';
import { AccountContextValue } from '~/components/Contexts/Account/Account';
import { Textarea } from '~/components/Form/Textarea/Textarea';
import { Button } from '~/components/Form/Button/Button';

interface UserWhitelistConfigurationForm {
  userWhitelist: string;
  removeUsers?: string;
}

export interface UserWhitelistConfigurationProps {
  policyManager: string;
  policy: PolicyDefinition;
  allPolicies?: FundPolicy[];
  startTransaction: (tx: Deployment<UserWhitelist> | Transaction<TransactionReceipt>, name: string) => void;
}

export const UserWhitelistConfiguration: React.FC<UserWhitelistConfigurationProps> = (props) => {
  const environment = useEnvironment()!;
  const account = useAccount();

  const preExistingPolicy = props.allPolicies?.find((policy) => policy.identifier === 'UserWhitelist') as
    | FundPolicy
    | undefined;

  return (
    <>
      <SectionTitle>
        {preExistingPolicy ? 'Update investor whitelist' : 'Configure Investor Whitelist Policy'}
      </SectionTitle>
      <NotificationBar kind="neutral">
        <NotificationContent>
          The investor whitelist policy defines a list of investor addresses which are allowed to invest into the fund.
          No other investors will be allowed into the fund.
        </NotificationContent>
      </NotificationBar>
      <UserWhitelistConfigurationForm
        environment={environment}
        account={account}
        startTransaction={props.startTransaction}
        preExistingPolicy={preExistingPolicy}
      />
    </>
  );
};

interface UserWhitelistConfigurationFormProps {
  environment: DeployedEnvironment;
  account: AccountContextValue;
  preExistingPolicy?: FundPolicy;
  startTransaction: (tx: Deployment<UserWhitelist> | Transaction<TransactionReceipt>, name: string) => void;
}

const initialValues = {
  userWhitelist: '',
  removeUsers: '',
};

const validationSchema = Yup.object().shape({
  userWhitelist: Yup.string().test('address-validation', 'Invalid address format', (userWhitelist: string) => {
    const whitelistedUsers = userWhitelist?.replace(/^\s+|\s+$/g, '').split('\n') as string[];

    if (whitelistedUsers && whitelistedUsers.some((address: string) => address && !isAddress(address))) {
      return false;
    }

    return true;
  }),
  removeUsers: Yup.string().test('address-validation', 'Invalid address format', function (removeUsers: string) {
    const removedUsers = removeUsers?.replace(/^\s+|\s+$/g, '').split('\n') as string[];
    const preExistingPolicy = (this.options.context as any).preExistingPolicy;

    if (preExistingPolicy && removedUsers && removedUsers.some((address: string) => address && !isAddress(address))) {
      return false;
    }

    if (removedUsers && removedUsers.some((address: string) => !isAddress(address))) {
      return false;
    }
    return true;
  }),
});

const UserWhitelistConfigurationForm: React.FC<UserWhitelistConfigurationFormProps> = ({
  account,
  environment,
  startTransaction,
  preExistingPolicy,
}) => {
  const validationContext = React.useMemo(
    () => ({
      preExistingPolicy,
    }),
    [preExistingPolicy]
  );

  const formik = useFormik({
    validationSchema,
    validationContext,
    initialValues,
    onSubmit: async (data) => {
      const whitelistedUsers = data.userWhitelist!.replace(/^\s+|\s+$/g, '').split('\n') as string[];
      const removedUsers = data.removeUsers?.replace(/^\s+|\s+$/g, '').split('\n') as string[];

      if (preExistingPolicy) {
        const userWhitelist = new UserWhitelist(environment, preExistingPolicy.address);

        if (whitelistedUsers && !whitelistedUsers.some((address: string) => !isAddress(address))) {
          const tx = userWhitelist.batchAddToWhitelist(account.address!, whitelistedUsers);
          startTransaction(tx, 'Add investors to whitelist');
        }
        if (removedUsers && !removedUsers.some((address: string) => !isAddress(address))) {
          const tx = userWhitelist.batchRemoveFromWhitelist(account.address!, removedUsers);
          startTransaction(tx, 'Remove investors from whitelist');
        }
      } else {
        const tx = UserWhitelist.deploy(environment, UserWhitelistBytecode, account.address!, whitelistedUsers);
        startTransaction(tx, 'Deploy InvestorWhitelist Contract');
      }
    },
  });

  return (
    <Form formik={formik}>
      <Textarea
        name="userWhitelist"
        placeholder={`${zeroAddress}\n${zeroAddress}`}
        id="userWhitelist"
        label="Investor addresses to add"
      />
      {preExistingPolicy && (
        <Textarea
          name="removeUsers"
          placeholder={`${zeroAddress}\n${zeroAddress}`}
          id="removeUsers"
          label="Investor addresses to remove"
        />
      )}
      <BlockActions>
        {preExistingPolicy ? (
          <Button>Update Investor Whitelist Policy</Button>
        ) : (
          <Button>Add Investor Whitelist Policy</Button>
        )}
      </BlockActions>
    </Form>
  );
};

export default UserWhitelistConfiguration;
