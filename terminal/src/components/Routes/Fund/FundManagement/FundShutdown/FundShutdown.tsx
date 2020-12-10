import React from 'react';
import { Version, Trading } from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { Button } from '~/components/Form/Button/Button';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { useAccount } from '~/hooks/useAccount';
import { Block, BlockActions } from '~/storybook/Block/Block';
import { SectionTitle } from '~/storybook/Title/Title';
import { useFundShutdownQuery } from '~/components/Routes/Fund/FundManagement/FundShutdown/FundShutdown.query';
import { TransactionDescription } from '~/components/Common/TransactionModal/TransactionDescription';

export interface ShutdownProps {
  address: string;
}

export const Shutdown: React.FC<ShutdownProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const [info, query] = useFundShutdownQuery(address);

  const assets = info.routes?.trading?.lockedAssets;
  const tradingAddress = info.routes?.trading?.address;
  const versionAddress = info.routes?.version?.address;

  const transaction = useTransaction(environment, {
    onAcknowledge: async () => {
      if (!!assets?.length) {
        const version = new Version(environment, versionAddress!);
        const tx = version.shutDownFund(account.address!, address);
        transaction.start(tx, 'Shutdown fund');
      }
    },
  });

  const submit = async () => {
    if (!!assets?.length) {
      const trading = new Trading(environment, tradingAddress!);
      const tokens = assets.map((asset) => asset.address!);
      const tx = trading.returnBatchToVault(account.address!, tokens);
      transaction.start(tx, 'Return assets to vault');
    } else {
      const version = new Version(environment, versionAddress!);
      const tx = version.shutDownFund(account.address!, address);
      transaction.start(tx, 'Shutdown fund');
    }
  };

  return (
    <Block>
      <SectionTitle>Shut Down Fund</SectionTitle>
      <p>
        Shutting down your fund closes the fund for new investors and trades will no longer be possible. Investors can
        still redeem their shares whenever they want.
      </p>

      <BlockActions>
        <Button type="submit" kind="danger" disabled={query.loading} loading={query.loading} onClick={() => submit()}>
          Shut Down Fund
        </Button>
      </BlockActions>

      <TransactionModal transaction={transaction}>
        {transaction.state.name === 'Return assets to vault' && (
          <TransactionDescription title="Return assets to Vault">
            This transaction returns all assets to the Vault contract, which is a prerequisit for shutting down a fund.
          </TransactionDescription>
        )}
        {transaction.state.name === 'Shutdown fund' && (
          <TransactionDescription title="Shutdown fund">
            This transaction shuts down your fund. The fund will be closed for new investors and trades will no longer
            be possible. Investors can still redeem their shares whenever they want.
          </TransactionDescription>
        )}
      </TransactionModal>
    </Block>
  );
};

export default Shutdown;
