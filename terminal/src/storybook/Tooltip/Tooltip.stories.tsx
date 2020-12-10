import React from 'react';
import { Tooltip } from './Tooltip';

export default { title: 'Components|Tooltip' };

export const Default: React.FC = () => (
  <div>
    <Tooltip value="me">Hover</Tooltip>
  </div>
);
