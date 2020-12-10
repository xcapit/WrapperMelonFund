import React from 'react';
import BigNumber from 'bignumber.js';
import { format } from 'date-fns';

export interface FormattedDateProps {
  timestamp?: Date | BigNumber.Value | null;
  format?: string;
}

function ensureValidDate(date: Date | BigNumber.Value): Date | null {
  if (Object.prototype.toString.call(date) === '[object Date]') {
    if (isNaN((date as Date).getTime())) {
      return null;
    }

    return date as Date;
  }

  const bn = new BigNumber(date as number);
  if (bn.isFinite() && bn.isPositive() && !bn.isZero()) {
    return new Date(bn.integerValue().toNumber() * 1000);
  }

  return null;
}

export const FormattedDate: React.FC<FormattedDateProps> = (props) => {
  if (!props.timestamp) {
    return <>N/A</>;
  }

  const date = ensureValidDate(props.timestamp);
  return <>{date ? format(date, props.format || 'yyyy/MM/dd HH:mm O') : 'N/A'}</>;
};
