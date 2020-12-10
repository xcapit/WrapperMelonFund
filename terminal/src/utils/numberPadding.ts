import { range } from 'ramda';

export const numberPadding = (digits: number, maxDigits: number) => {
  return range(0, maxDigits - digits)
    .map(() => String.fromCharCode(160))
    .join('');
};
