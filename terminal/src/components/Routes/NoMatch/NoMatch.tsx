import React from 'react';
import { Redirect } from 'react-router';

export const NoMatch: React.FC = () => {
  return <Redirect to="/" />;
};

export default NoMatch;
