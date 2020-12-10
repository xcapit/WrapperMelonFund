import React from 'react';
import { SectionTitle } from '~/storybook/Title/Title';
import { Block } from '~/storybook/Block/Block';
import { Spinner } from '~/storybook/Spinner/Spinner';
import { TokenValueDisplay } from '~/components/Common/TokenValueDisplay/TokenValueDisplay';
import { useAccountBalanceQuery } from '~/components/Routes/Wallet/WalletOverview/WalletOverviewAccountBalance/AccountBalances.query';
import * as S from './WalletOverviewAccount.styles';

export interface WalletOverviewAccountBalanceProps {
  account?: string;
}

export const WalletOverviewAccountBalance: React.FC<WalletOverviewAccountBalanceProps> = ({ account }) => {
  const [balances, query] = useAccountBalanceQuery(account);

  if (query.loading) {
    return (
      <Block>
        <SectionTitle>Account Balances</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  return (
    <Block>
      <SectionTitle>Account Balances</SectionTitle>
      {balances.map((token) => (
        <S.Balance key={token.symbol}>
          <TokenValueDisplay value={token.balance} decimals={token.decimals} symbol={token.symbol} />
        </S.Balance>
      ))}
    </Block>
  );
};
