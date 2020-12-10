import BigNumber from 'bignumber.js';
import { findPriceChange } from './aggregatedOrderbook';

describe('digit identifier algo', () => {
  it('should identify the index at which one argument differs from the next', () => {
    // base price
    // comparison price
    // run function, return digit at which base price varies from comp
    // result should equal after
    const inputs = [
      [new BigNumber(31.239), new BigNumber(324.8329)],
      [new BigNumber(0.129032), new BigNumber(1.239)],
      [new BigNumber(0.01929), new BigNumber(0.0000002)],
      [new BigNumber(100.01929), new BigNumber(100.0000002)],
      [new BigNumber(100.0), new BigNumber(100.00000001)],
      [new BigNumber(10.9), new BigNumber(10.89)],
      [new BigNumber(1), new BigNumber(1)],
    ];

    const expected = [0, 0, 3, 5, 11, 3, undefined];

    inputs.forEach((item, index) => {
      expect(findPriceChange(item[0], item[1])).toEqual(expected[index]);
    });
  });
});
