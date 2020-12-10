import React, { useMemo } from 'react';
import * as Yup from 'yup';
import { TransactionReceipt } from 'web3-core';
import { Deployment, AssetBlacklist, PolicyDefinition, availableTokens, Transaction } from '@melonproject/melonjs';
import { AssetBlacklistBytecode } from '@melonproject/melonjs/abis/AssetBlacklist.bin';
import { Form, useFormik } from '~/components/Form/Form';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccount } from '~/hooks/useAccount';
import { SectionTitle } from '~/storybook/Title/Title';
import { BlockActions } from '~/storybook/Block/Block';
import { NotificationBar, NotificationContent } from '~/storybook/NotificationBar/NotificationBar';
import { FundPolicy, AssetBlacklistPolicy } from '../../FundDiligence/FundPolicies/FundPolicies.query';
import { Button } from '~/components/Form/Button/Button';
import { CheckboxGroup } from '~/components/Form/CheckboxGroup/CheckboxGroup';

const validationSchema = Yup.object().shape({
  assetBlacklist: Yup.array<string>()
    .label('Asset blacklist')
    .compact()
    .min(1, 'Select at least one asset')
    .test('maxOne', 'You can only add one new asset at a time.', function (assetBlacklist: string[]) {
      const preExistingPolicy = (this.options.context as any).preExistingPolicy as AssetBlacklistPolicy | undefined;

      if (!preExistingPolicy) {
        return true;
      }
      const assetsToAdd = assetBlacklist
        .map((asset) => !preExistingPolicy?.assetBlacklist.some((list) => list === asset) && asset)
        .filter((asset) => asset);

      if (assetsToAdd && assetsToAdd.length > 1) {
        return false;
      }

      return true;
    }),
});

export interface AssetBlacklistConfigurationProps {
  policyManager: string;
  policy: PolicyDefinition;
  allPolicies?: FundPolicy[];
  startTransaction: (tx: Deployment<AssetBlacklist> | Transaction<TransactionReceipt>, name: string) => void;
}

export const AssetBlacklistConfiguration: React.FC<AssetBlacklistConfigurationProps> = (props) => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const tokens = availableTokens(environment.deployment).filter((token) => !token.historic);

  const wethToken = environment.getToken('WETH')!;

  const preExistingPolicy = props.allPolicies?.find((policy) => policy.identifier === 'AssetBlacklist') as
    | AssetBlacklistPolicy
    | undefined;

  const validationContext = useMemo(
    () => ({
      preExistingPolicy,
    }),
    [preExistingPolicy]
  );

  const options = tokens.map((item) => ({
    label: `${item.symbol} (${item.name})`,
    value: item.address,
    disabled:
      (preExistingPolicy && preExistingPolicy?.assetBlacklist.some((address) => address === item.address)) ||
      item.address === wethToken.address,
  }));

  const initialValues = {
    assetBlacklist: preExistingPolicy?.assetBlacklist || [],
  };

  const formik = useFormik({
    validationSchema,
    validationContext,
    initialValues,
    onSubmit: (data) => {
      const assetsToAdd = data.assetBlacklist
        .map((asset) => !preExistingPolicy?.assetBlacklist.some((list) => list === asset) && asset)
        .filter((asset) => asset);

      if (preExistingPolicy && assetsToAdd && assetsToAdd[0]) {
        const assetBlackList = new AssetBlacklist(environment, preExistingPolicy.address);
        const tx = assetBlackList.addToBlacklist(account.address!, assetsToAdd[0]);
        props.startTransaction(tx, 'Update Asset Blacklist');
      } else if (!preExistingPolicy) {
        const tx = AssetBlacklist.deploy(environment, AssetBlacklistBytecode, account.address!, data.assetBlacklist);
        props.startTransaction(tx, 'Deploy AssetBlacklist Contract');
      }
    },
  });

  return (
    <>
      <SectionTitle>
        {preExistingPolicy ? 'Update Asset Blacklist Policy' : 'Configure Asset Blacklist Policy'}
      </SectionTitle>
      <NotificationBar kind="neutral">
        <NotificationContent>
          The asset blacklist policy defines a list of assets that the fund is not allowed to invest in. Please note
          that no assets can be remove from the blacklist once it has been registered. Assets can only be added to the
          blacklist.
        </NotificationContent>
      </NotificationBar>
      <NotificationBar kind="error">
        <NotificationContent>
          Deploying an asset blacklist policy cannot be undone. Once you have deployed an asset blacklist policy, you
          will only be able to add assets to your blacklist, you cannot remove assets from the blacklist. <br />
          <br />
          Policies protect investors, but they can also make your fund un-usable if they are too stringent.
        </NotificationContent>
      </NotificationBar>
      <Form formik={formik}>
        <CheckboxGroup options={options} name="assetBlacklist" />

        <BlockActions>
          {preExistingPolicy ? (
            <Button type="submit">Update Asset Blacklist Policy</Button>
          ) : (
            <Button type="submit">Add Asset Blacklist Policy</Button>
          )}
        </BlockActions>
      </Form>
    </>
  );
};

export default AssetBlacklistConfiguration;
