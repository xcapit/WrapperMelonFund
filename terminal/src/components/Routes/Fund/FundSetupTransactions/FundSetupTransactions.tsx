import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import * as R from 'ramda';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { Button } from '~/components/Form/Button/Button';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionReceipt } from 'web3-core';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Transaction } from '@melonproject/melonjs';
import { useAccountFundQuery } from './AccountFund.query';
import { Spinner } from '~/storybook/Spinner/Spinner';
import { NoMatch } from '~/components/Routes/NoMatch/NoMatch';
import { useHistory } from 'react-router';
import { versionContract } from '~/utils/deploymentContracts';
import { useAccount } from '~/hooks/useAccount';
import { Block, BlockActions } from '~/storybook/Block/Block';
import { SectionTitle } from '~/storybook/Title/Title';
import { GridCol, GridRow, Grid } from '~/storybook/Grid/Grid';
import { TransactionDescription } from '~/components/Common/TransactionModal/TransactionDescription';
import { getNetworkName } from '~/config';
import { CheckboxItem } from '~/components/Form/Checkbox/Checkbox';

interface TransactionPipelineItem {
  previous: string;
  name?: string;
  notificationHeader?: string;
  notificationBody?: string;
  end?: boolean;
  transaction?: () => Transaction<TransactionReceipt>;
}

interface TransactionPipeline {
  [key: string]: TransactionPipelineItem;
}

export const FundSetupTransactions: React.FC = () => {
  const [result, query] = useAccountFundQuery();
  const environment = useEnvironment()!;
  const account = useAccount();
  const history = useHistory();

  // TODO: This should use the version contract address of the fund that is being created.
  const factory = useMemo(() => versionContract(environment), [environment]);
  const pipeline: TransactionPipeline = useMemo(
    () => ({
      BEGIN: {
        name: 'Create Accounting Contract',
        notificationHeader: 'Create Accounting Contract (Step 2 of 9)',
        notificationBody:
          'The Accounting contract defines the accounting rules implemented by the fund, e.g. pricing of assets, GAV/NAV calculations, and share price calculations.',
        previous: 'Begin Setup',
        transaction: () => factory.createAccounting(account.address!),
      },
      ACCOUNTING: {
        name: 'Create Fee Manager Contract',
        notificationHeader: 'Create Fee Manager Contract (Step 3 of 9)',
        notificationBody:
          'The Fee Manager contract is responsible for the calculation and the allocation of the different fees for your fund.',
        previous: 'Accounting Contract',
        transaction: () => factory.createFeeManager(account.address!),
      },
      FEE_MANAGER: {
        name: 'Create Participation Contract',
        notificationHeader: 'Create Participation Contract (Step 4 of 9)',
        notificationBody:
          'The Participation contract is responsible for handling investments and redemptions for investors.',
        previous: 'Fee Manager Contract',
        transaction: () => factory.createParticipation(account.address!),
      },
      PARTICIPATION: {
        name: 'Create Policy Manager Contract',
        notificationHeader: 'Create Policy Manager Contract (Step 5 of 9)',
        notificationBody:
          'The Policy Manager contract is responsible for managing the different risk management and compliance policies for your fund (you can set up individual policies later).',
        previous: 'Participation Contract',
        transaction: () => factory.createPolicyManager(account.address!),
      },
      POLICY_MANAGER: {
        name: 'Create Shares Contract',
        notificationHeader: 'Create Shares Contract (Step 6 of 9)',
        notificationBody: 'The Shares contract is responsible for managing the shares of your fund.',
        previous: 'Policy Manager Contract',
        transaction: () => factory.createShares(account.address!),
      },
      SHARES: {
        name: 'Create Trading Contract',
        notificationHeader: 'Create Trading Contract (Step 7 of 9)',
        notificationBody:
          'The Trading contract interacts with various decentralized exchanges and allows you to trade on them.',
        previous: 'Shares Contract',
        transaction: () => factory.createTrading(account.address!),
      },
      TRADING: {
        name: 'Create Vault Contract',
        notificationHeader: 'Create Vault Contract (Step 8 of 9)',
        notificationBody: 'The Vault contract safely stores all assets of your fund.',
        previous: 'Trading Contract',
        transaction: () => factory.createVault(account.address!),
      },
      VAULT: {
        name: 'Complete Setup',
        notificationHeader: 'Complete Setup (Step 9 of 9)',
        notificationBody:
          'This transactions completes the setup process of your fund. Various permissions are set to keep your fund safe.',
        previous: 'Vault Contract',
        transaction: () => factory.completeSetup(account.address!),
      },
      COMPLETE: {
        previous: 'Setup complete',
        transaction: () => factory.completeSetup(account.address!),
        end: true,
      },
    }),
    [factory, environment]
  );

  const pipelineOrder = [
    'BEGIN',
    'ACCOUNTING',
    'FEE_MANAGER',
    'PARTICIPATION',
    'POLICY_MANAGER',
    'SHARES',
    'TRADING',
    'VAULT',
    'COMPLETE',
  ];

  const fund = result ? result.fund : undefined;
  const progress = fund ? fund.progress : undefined;
  const step = progress ? (pipeline[progress] as TransactionPipelineItem) : undefined;
  const next = useMemo(() => step && step.transaction && step.transaction(), [step]);

  const [checked, setChecked] = useState<boolean[]>();

  const [acknowledged, setAcknowledged] = useState(!!history.location.state);
  const transaction = useTransaction(environment, {
    onStart: () => setAcknowledged(false),
    onAcknowledge: () => setAcknowledged(true),
  });

  useEffect(() => {
    const index = pipelineOrder.findIndex((item) => item === progress);
    const newChecked = R.range(0, index + 1).map(() => true);
    setChecked(newChecked);

    if (fund && acknowledged && progress === 'COMPLETE') {
      const prefix = getNetworkName(environment.network)!;
      return history.push(`/${prefix}/fund/${fund!.address}`);
    }

    if (acknowledged && next) {
      return transaction.start(next, step!.name!);
    }
  }, [progress, fund, next, acknowledged]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    next && transaction.start(next, step!.name!);
  };

  return (
    <Grid>
      <GridRow justify="center">
        <GridCol sm={12} md={12} lg={12}>
          <Block>
            <SectionTitle>Fund Setup Transactions</SectionTitle>
            {query.loading && <Spinner />}
            {!query.loading && !step && <NoMatch />}
            {!query.loading && step && (
              <>
                <ul>
                  {pipelineOrder.map((item, index) => {
                    return (
                      <li key={item}>
                        <CheckboxItem
                          checked={checked?.[index]}
                          label={pipeline[item].previous}
                          name={item}
                          disabled={true}
                        />
                      </li>
                    );
                  })}
                </ul>
                {!step.end && (
                  <form onSubmit={submit}>
                    <BlockActions>
                      <Button>{step.name!}</Button>
                    </BlockActions>
                  </form>
                )}
              </>
            )}

            <TransactionModal transaction={transaction}>
              <TransactionDescription title={step?.notificationHeader}>{step?.notificationBody}</TransactionDescription>
            </TransactionModal>
          </Block>
        </GridCol>
      </GridRow>
    </Grid>
  );
};

export default FundSetupTransactions;
