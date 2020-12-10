import BigNumber from 'bignumber.js';
import { TokenDefinition } from '@melonproject/melonjs';

// TODO: Move this into melonjs.

export class TokenValue {
  public static fromToken(token: TokenDefinition, value: BigNumber.Value) {
    const exponent = new BigNumber(10).exponentiatedBy(token.decimals);
    return new TokenValue(token, new BigNumber(value).dividedBy(exponent));
  }

  protected readonly $value?: BigNumber;
  public readonly exponent: BigNumber;

  constructor(public readonly token: TokenDefinition, value?: BigNumber.Value) {
    this.exponent = new BigNumber(10).exponentiatedBy(this.token.decimals);

    if (BigNumber.isBigNumber(value)) {
      this.$value = value;
    } else if (value != null) {
      this.$value = new BigNumber(value);
    }
  }

  public get integer(): BigNumber | undefined {
    return this.$value?.multipliedBy(this.exponent).decimalPlaces(0);
  }

  public get value(): BigNumber | undefined {
    if (!this.$value) {
      return undefined;
    }

    return new BigNumber(this.$value);
  }

  // TODO: Deprecate this.
  public setValue(value: BigNumber.Value) {
    return new TokenValue(this.token, value);
  }

  public setDecimalValue(value: BigNumber.Value) {
    return new TokenValue(this.token, value);
  }

  public setIntegerValue(value: BigNumber.Value) {
    const decimals = new BigNumber(value).dividedBy(this.exponent);
    return new TokenValue(this.token, decimals);
  }

  public setToken(token: TokenDefinition) {
    return new TokenValue(token, this.$value);
  }
}
