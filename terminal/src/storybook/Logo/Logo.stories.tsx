import React from 'react';
import { Logo } from './Logo';

export default { title: 'Atoms|Logo' };

export const Default: React.FC = () => <Logo name="default" size="medium" />;

export const DefaultSmall: React.FC = () => <Logo name="default" size="small" />;

export const DefaultLarge: React.FC = () => <Logo name="default" size="large" />;

export const WithText: React.FC = () => <Logo name="with-text" size="medium" />;

export const WithBottomText: React.FC = () => <Logo name="with-bottom-text" size="medium" />;

export const WithoutBorder: React.FC = () => <Logo name="without-border" size="medium" />;
