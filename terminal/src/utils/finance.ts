import BigNumber from 'bignumber.js';

export function standardDeviation(values: number[]) {
  const avg = average(values);

  const squareDiffs = values.map((value) => {
    const diff = value - avg;
    const sqrDiff = diff * diff;
    return sqrDiff;
  });
  const avgSquareDiff = average(squareDiffs);
  const stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

/**
 *
 * @param data an array of asset prices as numbers or as bignumbers.
 * @returns an array of BigNumbers where each is the logReutrn of that day
 * NB: does not return timestamps; you need to be sure to pass the function
 * data that's sequential and that the asset prices are on a regular cadence
 */
function calculateLogReturns(data: number[] | BigNumber[]): BigNumber[] {
  return (data as any[]).map((item, index, array) => {
    const bn = new BigNumber(item);
    const returnSinceLastPriceUpdate = index > 0 ? bn.dividedBy(array[index - 1]).toNumber() - 1 : 0;
    let dailyReturn = returnSinceLastPriceUpdate;
    if (dailyReturn > 100 || dailyReturn <= -1) {
      dailyReturn = 0;
    }
    const logReturn = index > 0 ? new BigNumber(Math.log(1 + dailyReturn)) : new BigNumber(0);
    return logReturn;
  });
}

export function average(data: number[] | BigNumber[]) {
  const sum = (data as any[]).reduce((s: BigNumber, value: number | BigNumber) => {
    if (BigNumber.isBigNumber(value)) {
      return s.plus(value);
    }
    return s.plus(new BigNumber(value));
  }, new BigNumber(0));
  const avg = sum.dividedBy(data.length);
  return avg;
}

/**
 * Returns a BigNumber representing the holding period return of the asset given the current price and some historical price
 * @param currentPx a BigNumber representing the current price of the asset
 * @param historicalPx a BigNumber representing the historical price against which you're measuring
 */
export function calculateReturn(currentPx: BigNumber | number, historicalPx: BigNumber | number): BigNumber {
  const current = !BigNumber.isBigNumber(currentPx) ? new BigNumber(currentPx) : currentPx;
  const historical = !BigNumber.isBigNumber(historicalPx) ? new BigNumber(historicalPx) : historicalPx;
  return current.minus(historical).dividedBy(historical).multipliedBy(100);
}

/**
 * @param values is an array of BigNumbers that in most cases will represent an asset's price over time or its returns at a regular cadence
 * @returns a BigNumber equal to the standard deviation of those values
 */
export function calculateStdDev(values: BigNumber[]): BigNumber {
  const avg = average(values);
  const squareDiffs = values.map((value) => {
    const diff = value.minus(avg);
    const sqrDiff = diff.multipliedBy(diff);
    return sqrDiff;
  });
  const variance = average(squareDiffs);
  const stdDev = variance.sqrt();
  return stdDev;
}

/**
 * @param values is an array of BigNumbers that most cases will represent an asset's price over time.
 * @returns a BigNumber that is the result of the standard deviation of the log returns of an asset's price over the time period,
 * multiplied by the square root of the number of observations, multiplied by 100 (to display in %).
 * NB: Our implementation in the metrics component expects this function to be called on a series of data of length n that is composed of one
 * observation per day for n days.
 */

export function calculateVolatility(values: BigNumber[]): BigNumber {
  return calculateStdDev(calculateLogReturns(values)).multipliedBy(Math.sqrt(values.length)).multipliedBy(100);
}
