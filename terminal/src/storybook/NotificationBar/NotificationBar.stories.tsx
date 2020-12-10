import React from 'react';
import { NotificationBar, NotificationContent } from './NotificationBar';

export default { title: 'Components|NotificationBar' };

export const Default: React.FC = () => {
  return (
    <NotificationBar>
      <NotificationContent>
        <span>Neutral notification</span>
      </NotificationContent>
    </NotificationBar>
  );
};

export const Neutral: React.FC = () => {
  return (
    <NotificationBar kind="neutral">
      <NotificationContent>
        <span>Neutral notification</span>
      </NotificationContent>
    </NotificationBar>
  );
};

export const Error: React.FC = () => {
  return (
    <NotificationBar kind="error">
      <NotificationContent>
        <span>This fund is shut down</span>
      </NotificationContent>
    </NotificationBar>
  );
};

export const Warning: React.FC = () => {
  return (
    <NotificationBar kind="warning">
      <NotificationContent>
        <span>Please review X</span>
      </NotificationContent>
    </NotificationBar>
  );
};

export const Success: React.FC = () => {
  return (
    <NotificationBar kind="success">
      <NotificationContent>
        <span>Fund created with success</span>
      </NotificationContent>
    </NotificationBar>
  );
};

export const NeutralSmall: React.FC = () => {
  return (
    <NotificationBar kind="neutral" size="small">
      <NotificationContent>
        <span>Neutral notification</span>
      </NotificationContent>
    </NotificationBar>
  );
};

export const ErrorSmall: React.FC = () => {
  return (
    <NotificationBar kind="error" size="small">
      <NotificationContent>
        <span>This fund is shut down</span>
      </NotificationContent>
    </NotificationBar>
  );
};

export const WarningSmall: React.FC = () => {
  return (
    <NotificationBar kind="warning" size="small">
      <NotificationContent>
        <span>Please review X</span>
      </NotificationContent>
    </NotificationBar>
  );
};

export const SuccessSmall: React.FC = () => {
  return (
    <NotificationBar kind="success" size="small">
      <NotificationContent>
        <span>Fund created with success</span>
      </NotificationContent>
    </NotificationBar>
  );
};

export const NeutralDiscrete: React.FC = () => {
  return (
    <NotificationBar kind="neutral" layout="discrete" size="small">
      <NotificationContent>
        <span>Neutral notification</span>
      </NotificationContent>
    </NotificationBar>
  );
};

export const ErrorDiscrete: React.FC = () => {
  return (
    <NotificationBar kind="error" layout="discrete" size="small">
      <NotificationContent>
        <span>This fund is shut down</span>
      </NotificationContent>
    </NotificationBar>
  );
};

export const WarningDiscrete: React.FC = () => {
  return (
    <NotificationBar kind="warning" layout="discrete" size="small">
      <NotificationContent>
        <span>Please review X</span>
      </NotificationContent>
    </NotificationBar>
  );
};

export const SuccessDiscrete: React.FC = () => {
  return (
    <NotificationBar kind="success" layout="discrete" size="small">
      <NotificationContent>
        <span>Fund created with success</span>
      </NotificationContent>
    </NotificationBar>
  );
};
