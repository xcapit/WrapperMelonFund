import React from 'react';
import { AssetBlacklistPolicy } from './FundPolicies.query';
import { BodyCell } from '~/storybook/Table/Table';
import { DeployedEnvironment } from '@melonproject/melonjs';

interface AssetBlacklistProps {
  policy: AssetBlacklistPolicy;
  environment: DeployedEnvironment;
}

export const AssetBlacklist: React.FC<AssetBlacklistProps> = ({ policy, environment }) => {
  const addresses = policy.assetBlacklist
    .map((asset) => environment.getToken(asset)?.symbol ?? asset)
    .sort()
    .join(', ');

  return <BodyCell>{addresses}</BodyCell>;
};
