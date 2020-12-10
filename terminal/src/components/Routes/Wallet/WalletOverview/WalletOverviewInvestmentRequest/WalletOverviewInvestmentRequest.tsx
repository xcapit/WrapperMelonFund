import React from 'react';
import { Participation } from '@melonproject/melonjs';
import { InvestmentRequest } from '~/components/Routes/Wallet/WalletOverview/FundParticipationOverview.query';
import { BodyCell, BodyRow, BodyCellRightAlign } from '~/storybook/Table/Table';
import { FormattedDate } from '~/components/Common/FormattedDate/FormattedDate';
import { useInvestmentRequestStatusQuery } from '~/components/Routes/Wallet/WalletOverview/WalletOverviewInvestmentRequest/InvestmentRequestStatus.query';
import { Button } from '~/components/Form/Button/Button.styles';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccount } from '~/hooks/useAccount';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { TokenValueDisplay } from '~/components/Common/TokenValueDisplay/TokenValueDisplay';
import { TransactionDescription } from '~/components/Common/TransactionModal/TransactionDescription';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';

export const WalletOverviewInvestmentRequest: React.FC<InvestmentRequest> = (props) => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const [status, query] = useInvestmentRequestStatusQuery(props.account!, props.address);

  const asset = environment.getToken(props.requestAsset);

  const transaction = useTransaction(environment, {
    handleError: (error, validation) => {
      if (validation?.name === 'NoInvestmentRequestError') {
        return 'Your investment request was already successfully executed by someone else.';
      }
    },
  });

  const execute = () => {
    const contract = new Participation(environment, status?.address!);
    const tx = contract.executeRequestFor(account.address!, account.address!);
    transaction.start(tx, 'Execute investment request');
  };

  const cancel = () => {
    const participationAddress = status?.address;
    const participationContract = new Participation(environment, participationAddress);
    const tx = participationContract.cancelRequest(account.address!);
    transaction.start(tx, 'Cancel investment request');
  };

  const buttonAction = () => {
    if (status?.canCancelRequest) {
      return (
        <Button type="button" id="action" onClick={() => cancel()}>
          Cancel investment request
        </Button>
      );
    }

    if (status?.investmentRequestState === 'VALID') {
      return (
        <Button type="button" onClick={() => execute()}>
          Execute investment request
        </Button>
      );
    }

    if (status?.investmentRequestState === 'WAITING') {
      return <>Waiting for execution window</>;
    }

    return <></>;
  };

  return (
    <>
      <BodyRow>
        <BodyCell>{props.name}</BodyCell>
        <BodyCell>
          <FormattedDate timestamp={props.requestCreatedAt} />
        </BodyCell>
        <BodyCell>{props.requestAsset}</BodyCell>
        <BodyCellRightAlign>
          <TokenValueDisplay value={props.requestAmount} />
        </BodyCellRightAlign>
        <BodyCellRightAlign>
          <TokenValueDisplay value={props.requestShares} />
        </BodyCellRightAlign>
        <BodyCell>{!query.loading && buttonAction()}</BodyCell>
      </BodyRow>
      <TransactionModal transaction={transaction}>
        {status?.canCancelRequest && (
          <TransactionDescription title="Cancel investment request">
            Your investment request will be cancelled. The initially requested investment amount of{' '}
            <FormattedNumber
              value={fromTokenBaseUnit(props.requestAmount, asset.decimals)}
              suffix={props.requestAsset}
            />{' '}
            will be returned to your wallet
          </TransactionDescription>
        )}
        {status?.investmentRequestState === 'VALID' && (
          <TransactionDescription title="Execute investment request">
            Your investment request will be executed. You will receive{' '}
            <FormattedNumber value={fromTokenBaseUnit(props.requestShares, asset.decimals)} /> shares of the fund
            &laquo;
            {props.name}&raquo; for the maximal amount of{' '}
            <FormattedNumber value={fromTokenBaseUnit(props.requestAmount, asset.decimals)} suffix={asset.symbol} />{' '}
            (the exact amount is calculated from the current share price)
          </TransactionDescription>
        )}
      </TransactionModal>
    </>
  );
};
