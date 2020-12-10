import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccount } from '~/hooks/useAccount';
import { Participation } from '@melonproject/melonjs';
import { TransactionHookValues } from '~/hooks/useTransaction';
import { Button } from '~/components/Form/Button/Button';

export interface CancelRequestProps {
  participationAddress: string;
  transaction: TransactionHookValues;
}

export const CancelRequest: React.FC<CancelRequestProps> = (props) => {
  const environment = useEnvironment()!;
  const account = useAccount();

  const cancel = () => {
    const contract = new Participation(environment, props.participationAddress);
    const tx = contract.cancelRequest(account.address!);
    props.transaction.start(tx, 'Cancel investment request');
  };

  return (
    <Button type="button" id="action" onClick={() => cancel()}>
      Cancel Investment Request
    </Button>
  );
};
