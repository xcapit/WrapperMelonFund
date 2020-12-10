import React from 'react';
import { Bar, BarContent } from '~/storybook/Bar/Bar';
import { Headline } from '~/storybook/Headline/Headline';
import { useAccount } from '~/hooks/useAccount';
import { EtherscanLink } from '~/components/Common/EtherscanLink/EtherscanLink';
import { DataBlockSection, DataBlock } from '~/storybook/DataBlock/DataBlock';
import { TokenValueDisplay } from '~/components/Common/TokenValueDisplay/TokenValueDisplay';

export const WalletHeader: React.FC = () => {
  const account = useAccount()!;

  return (
    <Bar>
      <BarContent justify="between">
        <Headline title="Your account" text={<EtherscanLink address={account.address} />} icon="WALLET" />
        <DataBlockSection>
          <DataBlock label="Balance">
            <TokenValueDisplay value={account.eth!} symbol="ETH" />
          </DataBlock>
        </DataBlockSection>
      </BarContent>
    </Bar>
  );
};
