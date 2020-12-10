import BigNumber from 'bignumber.js';

export function calculateChangeFromSharePrice(current?: BigNumber | number, previous?: BigNumber | number): BigNumber {
  const bnCurrent = BigNumber.isBigNumber(current) ? current : new BigNumber(current ?? 'NaN');
  const bnPrevious = BigNumber.isBigNumber(previous) ? previous : new BigNumber(previous ?? 'NaN');

  if (!bnCurrent.isZero() && !bnPrevious.isZero()) {
    return bnCurrent.dividedBy(bnPrevious).minus(1).multipliedBy(100);
  }
  return new BigNumber(0);
}
