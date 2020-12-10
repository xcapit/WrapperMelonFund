import React from 'react';
import { useAccount } from '~/hooks/useAccount';
import { TabBar, TabBarContent, TabBarSection, TabLink } from '~/storybook/TabNavigation/TabNavigation';

export const WalletNavigation: React.FC = () => {
  const account = useAccount();

  return (
    <TabBar>
      <TabBarContent>
        <TabBarSection>
          <TabLink to="/wallet" exact={true} activeClassName="active">
            Overview
          </TabLink>
          <TabLink to="/wallet/weth" exact={true} activeClassName="active">
            Wrap Ether
          </TabLink>
          {!account.fund && (
            <TabLink to={`/wallet/setup`} activeClassName="active">
              Create a Fund
            </TabLink>
          )}
        </TabBarSection>
      </TabBarContent>
    </TabBar>
  );
};
