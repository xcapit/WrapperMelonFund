import React from 'react';
import { RequiresFundManager } from '~/components/Gates/RequiresFundManager/RequiresFundManager';
import { RequiresFundNotShutDown } from '~/components/Gates/RequiresFundNotShutDown/RequiresFundNotShutDown';
import { TabBar, TabBarContent, TabBarSection, TabLink } from '~/storybook/TabNavigation/TabNavigation';
import { RequiresFundDeployedWithCurrentVersion } from '~/components/Gates/RequiresFundDeployedWithCurrentVersion/RequiresFundDeployedWithCurrentVersion';

export interface FundNavigationProps {
  prefix: string;
  address: string;
}

export const FundNavigation: React.FC<FundNavigationProps> = ({ prefix, address }) => {
  return (
    <TabBar>
      <TabBarContent justify="between">
        <TabBarSection>
          <TabLink to={prefix} exact={true} activeClassName="active">
            Overview
          </TabLink>
          <TabLink to={`${prefix}/invest`} exact={true} activeClassName="active">
            Invest &amp; Redeem
          </TabLink>
          <RequiresFundManager fallback={false}>
            <TabLink to={`${prefix}/trade`} exact={true} activeClassName="active">
              Trade
            </TabLink>
          </RequiresFundManager>
        </TabBarSection>
        <RequiresFundManager fallback={false}>
          <TabBarSection>
            <RequiresFundDeployedWithCurrentVersion address={address} fallback={false}>
              <RequiresFundNotShutDown fallback={false}>
                <TabLink to={`${prefix}/policies`} exact={true} activeClassName="active">
                  Ruleset
                </TabLink>
              </RequiresFundNotShutDown>
            </RequiresFundDeployedWithCurrentVersion>
            <TabLink to={`${prefix}/manage`} exact={true} activeClassName="active">
              Admin
            </TabLink>
          </TabBarSection>
        </RequiresFundManager>
      </TabBarContent>
    </TabBar>
  );
};
