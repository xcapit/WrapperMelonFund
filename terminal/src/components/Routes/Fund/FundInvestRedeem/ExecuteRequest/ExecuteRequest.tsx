import React, { forwardRef, useImperativeHandle } from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { TransactionHookValues } from '~/hooks/useTransaction';
import { Participation, Transaction } from '@melonproject/melonjs';
import { useAccount } from '~/hooks/useAccount';
import { Button } from '~/components/Form/Button/Button';
import { BigNumber } from 'bignumber.js';
import { TransactionRef } from '~/components/Routes/Fund/FundInvestRedeem/FundInvest/FundInvest';

export interface ExecuteRequestProps {
  participationAddress: string;
  currentShares: BigNumber;
  transaction: TransactionHookValues;
}

export const ExecuteRequest = forwardRef((props: ExecuteRequestProps, ref: React.Ref<TransactionRef | undefined>) => {
  const environment = useEnvironment()!;
  const account = useAccount();

  const execute = () => {
    const contract = new Participation(environment, props.participationAddress);
    const tx = contract.executeRequestFor(account.address!, account.address!);
    props.transaction.start(tx, 'Execute investment request');
  };

  useImperativeHandle(ref, () => ({
    next: (start: (transaction: Transaction, name: string) => void) => {
      if (props.currentShares.isZero()) {
        const contract = new Participation(environment, props.participationAddress);
        const tx = contract.executeRequestFor(account.address!, account.address!);
        props.transaction.start(tx, 'Execute investment request');
      }
    },
  }));

  return (
    <Button type="button" onClick={() => execute()}>
      Execute Investment Request
    </Button>
  );
});
