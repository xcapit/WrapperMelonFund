import React, { useState } from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useFundPoliciesQuery } from './FundPolicies.query';
import {
  PolicyManager,
  PriceTolerance,
  Deployment,
  MaxConcentration,
  MaxPositions,
  UserWhitelist,
  AssetWhitelist,
  AssetBlacklist,
  PolicyDefinition,
  Transaction,
} from '@melonproject/melonjs';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { PriceToleranceConfiguration } from '../PriceToleranceConfiguration/PriceToleranceConfiguration';
import { MaxPositionsConfiguration } from '../MaxPositionsConfiguration/MaxPositionsConfiguration';
import { MaxConcentrationConfiguration } from '../MaxConcentrationConfiguration/MaxConcentrationConfiguration';
import { UserWhitelistConfiguration } from '../UserWhitelistConfiguration/UserWhitelistConfiguration';
import { AssetWhitelistConfiguration } from '../AssetWhitelistConfiguration/AssetWhitelistConfiguration';
import { AssetBlacklistConfiguration } from '../AssetBlacklistConfiguration/AssetBlacklistConfiguration';
import { useAccount } from '~/hooks/useAccount';
import { Block } from '~/storybook/Block/Block';
import { SectionTitle } from '~/storybook/Title/Title';
import { Spinner } from '~/storybook/Spinner/Spinner';
import {
  RadioButtonContainer,
  RadioButtonInput,
  RadioButtonMask,
  RadioButtonIcon,
  RadioButtonLabel,
} from '~/storybook/RadioButton/RadioButton';
import { FundPolicyTransactionDescriptions } from './FundPolicyTransactionDescriptions';
import { TransactionReceipt } from 'web3-core';
import { Grid, GridRow, GridCol } from '~/storybook/Grid/Grid';

export interface FundRegisterPoliciesProps {
  address: string;
}

export const FundRegisterPolicies: React.FC<FundRegisterPoliciesProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const account = useAccount()!;
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyDefinition>();
  const [policyManager, query] = useFundPoliciesQuery(address);

  const transaction = useTransaction(environment, {
    onAcknowledge: (receipt) => {
      if (receipt.contractAddress && selectedPolicy) {
        const manager = new PolicyManager(environment, policyManager!.address);
        const signatures = selectedPolicy.signatures;
        const addresses = Array.from(Array(selectedPolicy.signatures.length).keys()).map(
          () => receipt.contractAddress!
        );

        const tx = manager.batchRegisterPolicies(account.address!, signatures, addresses);
        transaction.start(tx, `Register ${selectedPolicy.name} policy`);
      }
    },
  });

  const startTransaction = (
    tx:
      | Transaction<TransactionReceipt>
      | Deployment<PriceTolerance | MaxPositions | MaxConcentration | UserWhitelist | AssetWhitelist | AssetBlacklist>,
    name: string
  ) => transaction.start(tx, name);

  if (query.loading) {
    return (
      <Block>
        <SectionTitle>Configure Fund Ruleset</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  return (
    <Block>
      <Grid noGap={true}>
        <GridRow>
          <GridCol xs={12} sm={6} md={6}>
            <SectionTitle>Configure Fund Ruleset</SectionTitle>
            <p>
              Configure the risk management profile of your fund and the rules to be enforced by the smart contracts.
            </p>

            <p>Please select the policy that you want to add:</p>
            <ul>
              {environment.policies.map((policy) => {
                return (
                  <li key={policy.name}>
                    <RadioButtonContainer>
                      <RadioButtonInput
                        type="radio"
                        id={policy.name}
                        name="addPolicy"
                        onClick={() => setSelectedPolicy(policy)}
                      />
                      <RadioButtonMask>
                        <RadioButtonIcon />
                      </RadioButtonMask>
                      <RadioButtonLabel htmlFor={policy.name}>{policy.name}</RadioButtonLabel>
                    </RadioButtonContainer>
                  </li>
                );
              })}
            </ul>
            <p>&nbsp;</p>
          </GridCol>

          <GridCol xs={12} sm={6} md={6}>
            {policyManager && selectedPolicy?.id === 'priceTolerance' && (
              <PriceToleranceConfiguration
                policyManager={policyManager.address!}
                policy={selectedPolicy}
                allPolicies={policyManager.policies}
                startTransaction={startTransaction}
              />
            )}

            {policyManager && selectedPolicy?.id === 'maxPositions' && (
              <MaxPositionsConfiguration
                policyManager={policyManager.address!}
                policy={selectedPolicy}
                allPolicies={policyManager.policies}
                startTransaction={startTransaction}
              />
            )}

            {policyManager && selectedPolicy?.id === 'maxConcentration' && (
              <MaxConcentrationConfiguration
                policyManager={policyManager.address!}
                policy={selectedPolicy}
                allPolicies={policyManager.policies}
                startTransaction={startTransaction}
              />
            )}

            {policyManager && selectedPolicy?.id === 'userWhitelist' && (
              <UserWhitelistConfiguration
                policyManager={policyManager.address!}
                policy={selectedPolicy}
                allPolicies={policyManager.policies}
                startTransaction={startTransaction}
              />
            )}

            {policyManager && selectedPolicy?.id === 'assetWhitelist' && (
              <AssetWhitelistConfiguration
                policyManager={policyManager.address!}
                policy={selectedPolicy}
                allPolicies={policyManager.policies}
                startTransaction={startTransaction}
              />
            )}

            {policyManager && selectedPolicy?.id === 'assetBlacklist' && (
              <AssetBlacklistConfiguration
                policyManager={policyManager.address!}
                policy={selectedPolicy}
                allPolicies={policyManager.policies}
                startTransaction={startTransaction}
              />
            )}

            <TransactionModal transaction={transaction}>
              <FundPolicyTransactionDescriptions transaction={transaction} />
            </TransactionModal>
          </GridCol>
        </GridRow>
      </Grid>
    </Block>
  );
};
