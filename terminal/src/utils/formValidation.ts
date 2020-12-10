import * as Yup from 'yup';
import BigNumber from 'bignumber.js';
import { TokenValue } from '~/TokenValue';

export class BigNumberSchema extends Yup.mixed<BigNumber> implements Yup.Schema<BigNumber> {
  constructor() {
    super();

    this.withMutation(() => {
      this.transform(function (value, originalvalue) {
        if (this.isType(value)) {
          return value;
        }

        return new BigNumber(value);
      });
    });
  }

  protected _typeCheck(value: any) {
    return BigNumber.isBigNumber(value);
  }

  public required(message: Yup.TestOptionsMessage = 'This is a required field.') {
    return this.test({
      message: message,
      name: 'required',
      exclusive: true,
      test: function test(value?: BigNumber) {
        if (value != null && !value.isNaN()) {
          return true;
        }

        return false;
      },
    });
  }

  protected compare(boundary: BigNumber.Value | Yup.Ref, fn: (value: BigNumber, compare: BigNumber) => boolean) {
    return function (this: Yup.TestContext, value?: BigNumber.Value) {
      if (value == null) {
        return true;
      }

      const resolved = new BigNumber(this.resolve(boundary));
      if (resolved.isNaN()) {
        return false;
      }

      const bn = BigNumber.isBigNumber(value) ? value : new BigNumber(value);
      return fn(bn, resolved);
    };
  }

  public integer(message?: Yup.TestOptionsMessage) {
    return this.test({
      message: message,
      name: 'integer',
      exclusive: true,
      test: function (this: Yup.TestContext, value?: BigNumber) {
        if (value == null) {
          return true;
        }

        return value.isInteger();
      },
    });
  }

  public finite(message?: Yup.TestOptionsMessage) {
    return this.test({
      message: message,
      name: 'integer',
      exclusive: true,
      test: function (this: Yup.TestContext, value?: BigNumber) {
        if (value == null) {
          return true;
        }

        return value.isFinite();
      },
    });
  }

  public positive(message?: Yup.TestOptionsMessage) {
    return this.test({
      message: message,
      name: 'positive',
      exclusive: true,
      test: function (this: Yup.TestContext, value?: BigNumber) {
        if (value == null) {
          return true;
        }

        return value.isPositive();
      },
    });
  }

  public negative(message?: Yup.TestOptionsMessage) {
    return this.test({
      message: message,
      name: 'negative',
      exclusive: true,
      test: function (this: Yup.TestContext, value?: BigNumber) {
        if (value == null) {
          return true;
        }

        return value.isNegative();
      },
    });
  }

  public gte(boundary: BigNumber.Value | Yup.Ref, message?: Yup.TestOptionsMessage) {
    return this.test({
      message: message,
      name: 'gte',
      exclusive: true,
      test: this.compare(boundary, (value: BigNumber, compare: BigNumber) => value.gte(compare)),
    });
  }

  public gt(boundary: BigNumber.Value | Yup.Ref, message?: Yup.TestOptionsMessage) {
    return this.test({
      message: message,
      name: 'gt',
      exclusive: true,
      test: this.compare(boundary, (value: BigNumber, compare: BigNumber) => value.gt(compare)),
    });
  }

  public lte(boundary: BigNumber.Value | Yup.Ref, message?: Yup.TestOptionsMessage) {
    return this.test({
      message: message,
      name: 'lte',
      exclusive: true,
      test: this.compare(boundary, (value: BigNumber, compare: BigNumber) => value.lte(compare)),
    });
  }

  public lt(boundary: BigNumber.Value | Yup.Ref, message?: Yup.TestOptionsMessage) {
    return this.test({
      message: message,
      name: 'lt',
      exclusive: true,
      test: this.compare(boundary, (value: BigNumber, compare: BigNumber) => value.lt(compare)),
    });
  }
}

export class TokenValueSchema extends Yup.mixed<TokenValue> implements Yup.Schema<TokenValue> {
  protected _typeCheck(value: any) {
    return value instanceof TokenValue;
  }

  public required(message: Yup.TestOptionsMessage = 'This is a required field.') {
    return this.test({
      message: message,
      name: 'required',
      exclusive: true,
      test: function test(value?: TokenValue) {
        if (value?.value != null && !value.value.isNaN()) {
          return true;
        }

        return false;
      },
    });
  }

  protected compare(
    boundary: BigNumber.Value | TokenValue | Yup.Ref,
    fn: (value: BigNumber, compare: BigNumber) => boolean
  ) {
    return function (this: Yup.TestContext, value?: TokenValue) {
      if (value?.value == null) {
        return true;
      }

      const resolved = this.resolve(boundary);
      const bn = new BigNumber((resolved instanceof TokenValue ? resolved.value : resolved) ?? 'NaN');
      if (bn.isNaN()) {
        return false;
      }

      return fn(value.value, bn);
    };
  }

  public integer(message?: Yup.TestOptionsMessage) {
    return this.test({
      message: message,
      name: 'integer',
      exclusive: true,
      test: function (this: Yup.TestContext, value?: TokenValue) {
        if (value?.value == null) {
          return true;
        }

        return value.value.isInteger();
      },
    });
  }

  public finite(message?: Yup.TestOptionsMessage) {
    return this.test({
      message: message,
      name: 'integer',
      exclusive: true,
      test: function (this: Yup.TestContext, value?: TokenValue) {
        if (value?.value == null) {
          return true;
        }

        return value.value.isFinite();
      },
    });
  }

  public positive(message?: Yup.TestOptionsMessage) {
    return this.test({
      message: message,
      name: 'positive',
      exclusive: true,
      test: function (this: Yup.TestContext, value?: TokenValue) {
        if (value?.value == null) {
          return true;
        }

        return value.value.isPositive();
      },
    });
  }

  public negative(message?: Yup.TestOptionsMessage) {
    return this.test({
      message: message,
      name: 'negative',
      exclusive: true,
      test: function (this: Yup.TestContext, value?: TokenValue) {
        if (value?.value == null) {
          return true;
        }

        return value.value.isNegative();
      },
    });
  }

  public gte(boundary: BigNumber.Value | TokenValue | Yup.Ref, message?: Yup.TestOptionsMessage) {
    return this.test({
      message: message,
      name: 'gte',
      exclusive: true,
      test: this.compare(boundary, (value: BigNumber, compare: BigNumber) => value.gte(compare)),
    });
  }

  public gt(boundary: BigNumber.Value | TokenValue | Yup.Ref, message?: Yup.TestOptionsMessage) {
    return this.test({
      message: message,
      name: 'gt',
      exclusive: true,
      test: this.compare(boundary, (value: BigNumber, compare: BigNumber) => value.gt(compare)),
    });
  }

  public lte(boundary: BigNumber.Value | TokenValue | Yup.Ref, message?: Yup.TestOptionsMessage) {
    return this.test({
      message: message,
      name: 'lte',
      exclusive: true,
      test: this.compare(boundary, (value: BigNumber, compare: BigNumber) => value.lte(compare)),
    });
  }

  public lt(boundary: BigNumber.Value | TokenValue | Yup.Ref, message?: Yup.TestOptionsMessage) {
    return this.test({
      message: message,
      name: 'lt',
      exclusive: true,
      test: this.compare(boundary, (value: BigNumber, compare: BigNumber) => value.lt(compare)),
    });
  }
}

export function bigNumberSchema() {
  return new BigNumberSchema();
}

export function tokenValueSchema() {
  return new TokenValueSchema();
}
