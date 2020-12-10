import { AssetBlacklist, AssetWhitelist, MaxPositions, UserWhitelist } from '@melonproject/melongql';
import { sameAddress, Transaction } from '@melonproject/melonjs';
import React, { useMemo, useRef } from 'react';
import { FormattedDate } from '~/components/Common/FormattedDate/FormattedDate';
import { TokenValueDisplay } from '~/components/Common/TokenValueDisplay/TokenValueDisplay';
import { TransactionDescription } from '~/components/Common/TransactionModal/TransactionDescription';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { RequiresFundCreatedAfter } from '~/components/Gates/RequiresFundCreatedAfter/RequiresFundCreatedAfter';
import { RequiresFundManager } from '~/components/Gates/RequiresFundManager/RequiresFundManager';
import { RequiresFundNotShutDown } from '~/components/Gates/RequiresFundNotShutDown/RequiresFundNotShutDown';
import { usePriceFeedUpdateQuery } from '~/components/Layout/PriceFeedUpdate.query';
import { getNetworkName } from '~/config';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { Block } from '~/storybook/Block/Block';
import { Link } from '~/storybook/Link/Link';
import { Spinner } from '~/storybook/Spinner/Spinner';
import { SectionTitle } from '~/storybook/Title/Title';
import { TokenValue } from '~/TokenValue';
import { sharesToken } from '~/utils/sharesToken';
import { CancelRequest } from '../CancelRequest/CancelRequest';
import { ExecuteRequest } from '../ExecuteRequest/ExecuteRequest';
import { RequestInvestment } from '../RequestInvestment/RequestInvestment';
import { useFundInvestQuery } from './FundInvest.query';
import { KYC } from '../KYC/KYC';

export interface FundInvestProps {
  address: string;
}

export interface TransactionRef {
  next: (start: (transaction: Transaction, name: string) => void) => void;
}

export const FundInvest: React.FC<FundInvestProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const prefix = getNetworkName(environment.network)!;
  const [fundInvestResult, fundInvestQuery] = useFundInvestQuery(address);
  const [priceUpdateResult, priceUpdateQuery] = usePriceFeedUpdateQuery();

  const kycFunds = process.env.MELON_KYC_FUNDS.split(',');
  const kyc = kycFunds.find((fund) => sameAddress(fund, address));

  const currentShares = fundInvestResult?.fund?.routes?.shares?.totalSupply!;
  const existingRequest = fundInvestResult?.account?.participation?.request;
  const participationAddress = fundInvestResult?.account?.participation?.address!;
  const denominationAsset = fundInvestResult?.fund?.routes?.accounting?.denominationAsset!;
  const policies = fundInvestResult?.fund?.routes?.policyManager?.policies ?? [];
  const holdings = fundInvestResult?.fund?.routes?.accounting?.holdings ?? [];
  const assets = fundInvestResult?.fund?.routes?.participation?.allowedAssets ?? [];

  const assetWhitelist = React.useMemo(() => {
    const whitelists = policies.filter((policy) => policy.identifier === 'AssetWhitelist') as AssetWhitelist[];
    if (!whitelists.length) {
      return undefined;
    }

    const flat = whitelists.map((item) => item.assetWhitelist ?? []).flat();
    const addresses = flat.filter((item, index, array) => array.indexOf(item) === index);
    return addresses.map((item) => environment.getToken(item));
  }, [environment, policies]);

  const assetBlacklist = React.useMemo(() => {
    const blacklists = policies.filter((policy) => policy.identifier === 'AssetBlacklist') as AssetBlacklist[];
    if (!blacklists.length) {
      return undefined;
    }

    const flat = blacklists.map((item) => item.assetBlacklist ?? []).flat();
    const addresses = flat.filter((item, index, array) => array.indexOf(item) === index);
    return addresses.map((item) => environment.getToken(item));
  }, [environment, policies]);

  const maxPositions = React.useMemo(() => {
    const items = policies.filter((policy) => policy.identifier === 'MaxPositions') as MaxPositions[];
    return items.length ? Math.min(...items.map((item) => item.maxPositions!)) : undefined;
  }, [policies]);

  const accountWhitelisted = React.useMemo(() => {
    const whitelists = policies.filter((policy) => policy.identifier === 'UserWhitelist') as UserWhitelist[];
    if (!whitelists.length) {
      return true;
    }

    return whitelists.every((item) => !!item.isWhitelisted);
  }, [policies]);

  const allowedAssets = React.useMemo(() => {
    return assets.map((item) => {
      const token = environment.getToken(item.token!.address!);
      return TokenValue.fromToken(token, item.shareCostInAsset!);
    });
  }, [environment, assets]);

  const currentHoldings = React.useMemo(() => {
    const filtered = holdings.filter((holding) => !holding.amount?.isZero());
    return filtered.map((item) => {
      const token = environment.getToken(item.token!.address!);
      return TokenValue.fromToken(token, item.amount!);
    });
  }, [environment, holdings]);

  // TODO: Also check the MaxPositions policy here. If the number of current positions
  // is larger than the current fund's holdings, it only allows investment in the
  // denomination asset.
  const investableAssets = React.useMemo(() => {
    let allowed = allowedAssets;
    if (assetBlacklist != null) {
      allowed = allowed.filter((item) => !assetBlacklist.includes(item.token));
    }

    if (assetWhitelist != null) {
      allowed = allowed.filter((item) => assetWhitelist.includes(item.token));
    }

    // TODO: Use maxPositions, denominationAssets and currentHoldings values to limit
    // this list further if necessary.

    return allowed;
  }, [environment, currentHoldings, denominationAsset, maxPositions, allowedAssets, assetWhitelist, assetBlacklist]);

  const requestExecutionWindowStart = React.useMemo(() => {
    const oneDay = 24 * 60 * 60 * 1000;
    return new Date((priceUpdateResult?.getTime() || 0) + oneDay);
  }, [priceUpdateResult]);

  const requestExecutionWindowEnd = React.useMemo(() => {
    const oneDay = 24 * 60 * 60 * 1000;
    return new Date((existingRequest?.timestamp?.getTime() || 0) + oneDay);
  }, [existingRequest]);

  const investmentRequestTimestamp = existingRequest?.timestamp;
  const investmentRequestAmount = React.useMemo(() => {
    if (!existingRequest) {
      return undefined;
    }

    const token = environment.getToken(existingRequest.investmentAsset!);
    return TokenValue.fromToken(token, existingRequest.investmentAmount!);
  }, [environment, existingRequest]);

  const investmentRequestShares = React.useMemo(() => {
    if (!existingRequest) {
      return undefined;
    }

    return TokenValue.fromToken(sharesToken, existingRequest?.requestedShares!);
  }, [existingRequest]);

  const transactionRef = useRef<TransactionRef>();
  const transaction = useTransaction(environment, {
    onAcknowledge: () => {
      if (transactionRef.current) {
        transactionRef.current.next(transaction.start);
      }
    },
    handleError: (error, validation) => {
      if (validation?.name === 'NoInvestmentRequestError') {
        return 'Your investment request was already successfully executed by someone else.';
      }
    },
  });

  const investmentStep = useMemo(() => {
    const canCancelRequest = fundInvestResult?.account?.participation?.canCancelRequest;
    if (canCancelRequest) {
      return 'cancel';
    }

    const investmentRequestState = fundInvestResult?.account?.participation?.investmentRequestState;
    if (investmentRequestState === 'VALID') {
      return 'execute';
    }

    if (investmentRequestState === 'WAITING') {
      return 'waiting';
    }

    if (investmentRequestState === 'NONE') {
      return 'invest';
    }
  }, [fundInvestResult]);

  if (fundInvestQuery.loading || priceUpdateQuery.loading) {
    return (
      <Block>
        <SectionTitle>Invest</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  if (!accountWhitelisted && !kyc) {
    return (
      <Block>
        <SectionTitle>Invest</SectionTitle>
        <p>This fund operates an investor whitelist and you are currently not on that whitelist.</p>
      </Block>
    );
  }

  if (!accountWhitelisted && kyc) {
    return <KYC address={address} />;
  }

  return (
    <Block>
      <SectionTitle
        tooltip="Fill out the form below to request an investment in this fund. Your request will be executed after the next price update, which usually occur in the morning UTC."
        placement="auto"
      >
        Invest
      </SectionTitle>

      <RequiresFundNotShutDown fallback="This fund is already shut down. You can only invest in active funds.">
        <RequiresFundCreatedAfter
          after={new Date('2019-12-19')}
          fallback={
            'The Melon Terminal does not support investments in funds which are running on deprecated versions of the Melon protocol.'
          }
        >
          {investmentStep === 'cancel' && (
            <CancelRequest participationAddress={participationAddress} transaction={transaction} />
          )}

          {investmentStep === 'invest' && (
            <>
              {investableAssets.length ? (
                <RequestInvestment
                  ref={transactionRef}
                  fundAddress={address}
                  participationAddress={participationAddress}
                  investableAssets={investableAssets}
                  currentShares={currentShares!}
                  transaction={transaction}
                  denominationAsset={denominationAsset}
                />
              ) : (
                <>
                  <p>
                    You cannot invest into this fund because it has not defined any investable assets and/or the risk
                    management restrictions prevent the investment in any asset.
                  </p>

                  <RequiresFundManager fallback={false}>
                    As the fund manager, you can on{' '}
                    <Link to={`/${prefix}/fund/${address}/manage`}>adapt the list of investable assets</Link>.
                  </RequiresFundManager>
                </>
              )}
            </>
          )}

          {investmentStep === 'execute' && (
            <ExecuteRequest
              ref={transactionRef}
              participationAddress={participationAddress}
              currentShares={currentShares!}
              transaction={transaction}
            />
          )}

          {investmentStep === 'waiting' && (
            <>
              <p>You have a pending investment request:</p>

              <p>
                Requested shares: <TokenValueDisplay value={investmentRequestShares} />
                <br />
                Investment amount: <TokenValueDisplay value={investmentRequestAmount} />
                <br />
                Request date: <FormattedDate timestamp={investmentRequestTimestamp} />
              </p>

              <p>
                Your investment request will be automatically executed after the next price update, which will be at
                approximately <FormattedDate timestamp={requestExecutionWindowStart} />.
              </p>

              <p>
                If you come back during the execution window (which starts at around{' '}
                <FormattedDate timestamp={requestExecutionWindowStart} /> and ends at{' '}
                <FormattedDate timestamp={requestExecutionWindowEnd} />
                ), and your investment request hasn't been automatically executed, you will see here the option to
                execute it yourself.
              </p>
            </>
          )}

          <TransactionModal transaction={transaction}>
            {transaction.state.name === 'Approve' && (
              <TransactionDescription title="Approve">
                You are approving the fund's Participation contract to transfer your investment amount to itself.{' '}
              </TransactionDescription>
            )}
            {transaction.state.name === 'Invest' && (
              <TransactionDescription title="Request investment">
                You are creating the actual investment request into the fund.
              </TransactionDescription>
            )}
            {transaction.state.name === 'Execute investment request' && (
              <TransactionDescription title="Execute investment request">
                You are executing the investment request.
              </TransactionDescription>
            )}
            {transaction.state.name === 'Cancel investment request' && (
              <TransactionDescription title="Cancel">
                Your investment request will be cancelled. The initially requested investment amount will be returned to
                your wallet.
              </TransactionDescription>
            )}
          </TransactionModal>
        </RequiresFundCreatedAfter>
      </RequiresFundNotShutDown>
    </Block>
  );
};
