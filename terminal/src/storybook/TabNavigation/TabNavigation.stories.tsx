import React from 'react';
import { TabBar, TabBarContent, TabBarSection, TabLink } from './TabNavigation';

export default { title: 'Layouts|TabNavigation' };

export const Default: React.FC = () => {
  return (
    <TabBar>
      <TabBarContent justify="between">
        <TabBarSection>
          <TabLink to="/">Overview</TabLink>
          <TabLink to="/">Wraph Ether</TabLink>
          <TabLink to="/">Setup your fund</TabLink>
        </TabBarSection>
      </TabBarContent>
    </TabBar>
  );
};

export const WithSections: React.FC = () => {
  return (
    <TabBar>
      <TabBarContent justify="between">
        <TabBarSection>
          <TabLink to="/">Overview</TabLink>
          <TabLink to="/">Invest &amp; redeem</TabLink>
        </TabBarSection>
        <TabBarSection>
          <TabLink to="/">Trade</TabLink>
          <TabLink to="/">Risk Profile</TabLink>
          <TabLink to="/">Manage fund</TabLink>
        </TabBarSection>
      </TabBarContent>
    </TabBar>
  );
};
