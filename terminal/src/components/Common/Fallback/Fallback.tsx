import React from 'react';
import { NotificationBar, NotificationContent } from '~/storybook/NotificationBar/NotificationBar';

export interface FallbackProps {
  kind?: 'neutral' | 'warning' | 'error' | 'success';
}

export const Fallback: React.FC<FallbackProps> = ({ children, kind = 'error' }) => {
  return (
    <NotificationBar kind={kind}>
      <NotificationContent>{children}</NotificationContent>
    </NotificationBar>
  );
};
