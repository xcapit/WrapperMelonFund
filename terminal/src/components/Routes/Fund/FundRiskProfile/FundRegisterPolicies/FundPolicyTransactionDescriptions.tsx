import React from 'react';
import { TransactionHookValues } from '~/hooks/useTransaction';
import { TransactionDescription } from '~/components/Common/TransactionModal/TransactionDescription';

export interface FundPolicyTransactionDescriptionProps {
  transaction: TransactionHookValues;
}

export const FundPolicyTransactionDescriptions: React.FC<FundPolicyTransactionDescriptionProps> = ({ transaction }) => {
  switch (transaction.state.name) {
    case 'Deploy PriceTolerance Contract': {
      return (
        <TransactionDescription title="Deploy PriceTolerance Contract">
          You are deploying a PriceTolerance policy contract for your fund.
        </TransactionDescription>
      );
    }

    case 'Register Price tolerance policy': {
      return (
        <TransactionDescription title="Deploy PriceTolerance Contract">
          You are now registering the Price Tolerance policy that has just been deployed with your fund.
        </TransactionDescription>
      );
    }

    case 'Deploy MaxPositions Contract': {
      return (
        <TransactionDescription title="Deploy MaxPositions Contract">
          You are deploying a MaxPositions policy contract for your fund.
        </TransactionDescription>
      );
    }

    case 'Register Maximum number of positions policy': {
      return (
        <TransactionDescription title="Register Maximum number of positions policy">
          You are now registering the maximum number of positions policy that has just been deployed with your fund.
        </TransactionDescription>
      );
    }

    case 'Deploy MaxConcentration Contract': {
      return (
        <TransactionDescription title="Deploy MaxConcentration Contract">
          You are deploying a MaxConcentration policy contract for your fund.
        </TransactionDescription>
      );
    }

    case 'Register Maximum concentration policy': {
      return (
        <TransactionDescription title="Register Maximum concentration policy">
          You are now registering the maximum concentration policy that has just been deployed with your fund.
        </TransactionDescription>
      );
    }

    case 'Deploy InvestorWhitelist Contract': {
      return (
        <TransactionDescription title="Deploy InvestorWhitelist Contract">
          You are deploying a InvestorWhitelist policy contract for your fund.
        </TransactionDescription>
      );
    }

    case 'Register Investor whitelist policy': {
      return (
        <TransactionDescription title="Register Investor whitelist policy">
          You are now registering the investor whitelist policy that has just been deployed with your fund.
        </TransactionDescription>
      );
    }

    case 'Add investors to whitelist': {
      return (
        <TransactionDescription title="Add investors to whitelist">
          You are adding investor addresses to the investor whitelist.
        </TransactionDescription>
      );
    }

    case 'Remove investors from whitelist': {
      return (
        <TransactionDescription title="Remove investors from whitelist">
          You are removing investor addresses from the investor whitelist.
        </TransactionDescription>
      );
    }

    case 'Deploy AssetWhitelist Contract': {
      return (
        <TransactionDescription title="Deploy AssetWhitelist Contract">
          You are deploying an AssetWhitelist policy contract for your fund.
        </TransactionDescription>
      );
    }

    case 'Register Asset whitelist policy': {
      return (
        <TransactionDescription title="Register Asset whitelist policy">
          You are now registering the AssetWhitelist policy that has just been deployed with your fund.
        </TransactionDescription>
      );
    }

    case 'Update Asset Whitelist': {
      return (
        <TransactionDescription title="Update Asset Whitelist">
          You are removing assets from the asset whitelist.
        </TransactionDescription>
      );
    }

    case 'Deploy AssetBlacklist Contract': {
      return (
        <TransactionDescription title="Deploy AssetBlacklist Contract">
          You are deploying an AssetBlacklist policy contract for your fund.
        </TransactionDescription>
      );
    }

    case 'Register Asset blacklist policy': {
      return (
        <TransactionDescription title="Register Asset whitelist policy">
          You are now registering the AssetBlacklist policy that has just been deployed with your fund.
        </TransactionDescription>
      );
    }

    case 'Update Asset Blacklist': {
      return (
        <TransactionDescription title="Update Asset Blacklist">
          You are adding assets to the asset blacklist.
        </TransactionDescription>
      );
    }

    default: {
      return <></>;
    }
  }
};
