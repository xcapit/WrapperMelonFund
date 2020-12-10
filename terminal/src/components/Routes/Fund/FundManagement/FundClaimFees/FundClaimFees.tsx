import React, { useMemo } from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { Accounting, FeeManager } from '@melonproject/melonjs';
import { Button } from '~/components/Form/Button/Button';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { useFundDetailsQuery } from './FundDetails.query';
import { Spinner } from '~/storybook/Spinner/Spinner';
import { useAccount } from '~/hooks/useAccount';
import { Block, BlockActions } from '~/storybook/Block/Block';
import { SectionTitle } from '~/storybook/Title/Title';
import { DictionaryData, DictionaryEntry, DictionaryLabel } from '~/storybook/Dictionary/Dictionary';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { TokenValueDisplay } from '~/components/Common/TokenValueDisplay/TokenValueDisplay';
import { TransactionDescription } from '~/components/Common/TransactionModal/TransactionDescription';
import BigNumber from 'bignumber.js';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';
import { NotificationBar, NotificationContent } from '~/storybook/NotificationBar/NotificationBar';
import { FormattedDate } from '~/components/Common/FormattedDate/FormattedDate';

export interface ClaimFeesProps {
  address: string;
}

export const ClaimFees: React.FC<ClaimFeesProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const [details, query] = useFundDetailsQuery(address);

  const accountingAddress = details && details.routes && details.routes.accounting && details.routes.accounting.address;
  const accounting = new Accounting(environment, accountingAddress);
  const feeManagerInfo = details && details.routes && details.routes.feeManager;
  const feeManagerAddress = feeManagerInfo && feeManagerInfo.address;
  const feeManager = new FeeManager(environment, feeManagerAddress);

  const transaction = useTransaction(environment);

  const [claimPeriodStart, claimPeriodEnd, inClaimPeriod] = useMemo(() => {
    const now = Date.now() / 1000;

    const initializeTime = new Date(feeManagerInfo?.performanceFee?.initializeTime || 0).getTime() / 1000;
    const performanceFeePeriod = (feeManagerInfo?.performanceFee?.period || 0) * 24 * 60 * 60;
    const secondsSinceInit = now - initializeTime;
    const secondsSinceLastPeriod = secondsSinceInit % performanceFeePeriod;
    const lastPeriodEnd = now - secondsSinceLastPeriod;
    const lastPayoutTime = new Date(feeManagerInfo?.performanceFee?.lastPayoutTime || 0).getTime() / 1000;
    const redeemPeriodLength = 7 * 24 * 60 * 60;

    if (secondsSinceLastPeriod < redeemPeriodLength && lastPayoutTime < lastPeriodEnd) {
      return [new Date((lastPeriodEnd + 1) * 1000), new Date((lastPeriodEnd + redeemPeriodLength) * 1000), true];
    }

    return [
      new Date((lastPeriodEnd + performanceFeePeriod + 1) * 1000),
      new Date((lastPeriodEnd + performanceFeePeriod + redeemPeriodLength) * 1000),
      false,
    ];
  }, [feeManagerInfo]);

  const submitAllFees = () => {
    const tx = accounting.triggerRewardAllFees(account.address!);
    transaction.start(tx, 'Claim all fees');
  };

  const submitManagementFees = () => {
    const tx = feeManager.rewardManagementFee(account.address!);
    transaction.start(tx, 'Claim management fees');
  };

  if (query.loading) {
    return (
      <Block>
        <SectionTitle>Claim Fees</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  return (
    <Block>
      <SectionTitle>Claim Fees</SectionTitle>

      <p>Claim management fees and performance fees for the fund.</p>

      <DictionaryEntry>
        <DictionaryLabel>Accrued management fee</DictionaryLabel>
        <DictionaryData>
          <TokenValueDisplay value={feeManagerInfo!.managementFeeAmount} />
        </DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Accrued performance fee</DictionaryLabel>
        <DictionaryData>
          <TokenValueDisplay value={feeManagerInfo!.performanceFeeAmount} />
        </DictionaryData>
      </DictionaryEntry>

      <NotificationBar kind="neutral">
        <NotificationContent>
          Management fees can be claimed at any time.
          <br />
          <br />
          Performance fees can be claimed within a window of one week after the end of a performance fee period.
          <br />
          <br />
          {inClaimPeriod ? (
            <>
              You can currently claim your performance fees. The window ends at{' '}
              <FormattedDate timestamp={claimPeriodEnd} />{' '}
            </>
          ) : (
            <>
              You cannot currently claim your performance fees. The current performance fee period ends on{' '}
              <FormattedDate timestamp={claimPeriodStart} />, and you will have to claim your performance fees before{' '}
              <FormattedDate timestamp={claimPeriodEnd} />.
            </>
          )}
        </NotificationContent>
      </NotificationBar>

      <BlockActions>
        <Button type="submit" onClick={() => submitAllFees()} disabled={!feeManagerInfo?.performanceFee?.canUpdate}>
          Claim All Fees
        </Button>
        <Button type="submit" onClick={() => submitManagementFees()}>
          Claim Management Fees
        </Button>
      </BlockActions>

      <TransactionModal transaction={transaction}>
        {transaction.state.name === 'Claim all fees' && (
          <TransactionDescription title="Claim all fees">
            You are claiming all accrued fees (
            <FormattedNumber
              value={fromTokenBaseUnit(feeManagerInfo!.managementFeeAmount, 18)}
              suffix="WETH"
              tooltip={true}
            />
            ) for this fund.
          </TransactionDescription>
        )}
        {transaction.state.name === 'Claim management fees' && (
          <TransactionDescription title="Claim management fee">
            You are claiming the accrued management fees (
            <FormattedNumber
              value={fromTokenBaseUnit(
                new BigNumber(feeManagerInfo!.managementFeeAmount).plus(
                  new BigNumber(feeManagerInfo!.performanceFeeAmount)
                ),
                18
              )}
              suffix="WETH"
              tooltip={true}
            />
            ) for this fund.
          </TransactionDescription>
        )}
      </TransactionModal>
    </Block>
  );
};

export default ClaimFees;
