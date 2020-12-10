import BigNumber from 'bignumber.js';

export const sortBigNumber = (a: BigNumber, b: BigNumber): number => {
  if (a.isNaN() && b.isNaN()) {
    return 0;
  }
  if (a.isNaN()) {
    return 1;
  }
  if (b.isNaN()) {
    return -1;
  }
  return b.comparedTo(a);
};
