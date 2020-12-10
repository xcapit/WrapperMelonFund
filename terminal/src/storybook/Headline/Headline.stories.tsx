import React from 'react';
import { Headline } from './Headline';

export default { title: 'Components|Headline' };

export const Default: React.FC = () => <Headline title="I'm a default headline with an Icon" icon="WALLET" />;

export const JustTitle: React.FC = () => <Headline title="I'm Just a Title headline" />;

export const WithSideInfo: React.FC = () => (
  <Headline title="I'm a Title headline" text="I'm extra side info that needs to be here" icon="ETHEREUM" />
);
