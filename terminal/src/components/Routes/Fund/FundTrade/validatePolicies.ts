import {
  AssetBlacklist,
  AssetWhitelist,
  Holding,
  MaxConcentration,
  MaxPositions,
  Policy,
  PriceTolerance,
  Token,
} from '@melonproject/melongql';
import { DeployedEnvironment, IPriceSource, sameAddress, TokenDefinition, Trading } from '@melonproject/melonjs';
import BigNumber from 'bignumber.js';
import { toTokenBaseUnit } from '../../../../utils/toTokenBaseUnit';

interface ValidatePoliciesArguments {
  environment: DeployedEnvironment;
  tradingAddress: string;
  policies: Policy[] | undefined;
  holdings: Holding[];
  taker: TokenDefinition;
  maker: TokenDefinition;
  takerAmount: BigNumber;
  makerAmount: BigNumber;
  denominationAsset?: Token;
}

export const validatePolicies = async (args: ValidatePoliciesArguments) => {
  const errors: string[] = [];
  const assetWhitelists = args.policies?.filter((policy) => policy.identifier === 'AssetWhitelist') as
    | AssetWhitelist[]
    | undefined;
  const assetBlacklists = args.policies?.filter((policy) => policy.identifier === 'AssetBlacklist') as
    | AssetBlacklist[]
    | undefined;

  const maxConcentrationPolicies = args.policies?.filter((policy) => policy.identifier === 'MaxConcentration') as
    | MaxConcentration[]
    | undefined;
  const maxPositionsPolicies = args.policies?.filter((policy) => policy.identifier === 'MaxPositions') as
    | MaxPositions[]
    | undefined;
  const priceTolerancePolicies = args.policies?.filter((policy) => policy.identifier === 'PriceTolerance') as
    | PriceTolerance[]
    | undefined;

  const nonZeroHoldings = args.holdings.filter((holding) => !holding.amount?.isZero());
  const gav = nonZeroHoldings?.reduce(
    (carry, item) => carry.plus(item.value || new BigNumber(0)),
    new BigNumber(0)
  ) as BigNumber;

  // Asset Whitelist
  if (assetWhitelists?.length) {
    const valid = assetWhitelists.every((list) =>
      list.assetWhitelist?.some((item) => sameAddress(item, args.maker.address))
    );

    if (!valid) {
      errors.push('This investment would violate the asset whitelist policy');
    }
  }

  // Asset Blacklist
  if (assetBlacklists?.length) {
    const valid = !assetBlacklists.some((list) =>
      list.assetBlacklist?.some((item) => sameAddress(item, args.maker.address))
    );

    if (!valid) {
      errors.push('This investment would violate the asset blacklist policy');
    }
  }

  // Max Positions Policies
  if (!(!maxPositionsPolicies?.length || sameAddress(args.maker.address, args.denominationAsset?.address))) {
    const taker = nonZeroHoldings?.find((holding) => sameAddress(holding.token?.address, args.taker.address));
    const count = taker?.amount?.isLessThanOrEqualTo(toTokenBaseUnit(args.takerAmount, args.taker.decimals))
      ? nonZeroHoldings?.length - 1
      : nonZeroHoldings?.length;
    const valid =
      // already existing token
      !!nonZeroHoldings?.some((holding) => sameAddress(holding.token?.address, args.maker.address)) ||
      // max positions larger than holdings (so new token would still fit)
      maxPositionsPolicies.every((policy) => policy.maxPositions && nonZeroHoldings && policy.maxPositions > count);

    if (!valid) {
      errors.push('This investment would violate the maximum number of positions policy');
    }
  }

  // Max Concentration Policies
  if (!(!maxConcentrationPolicies?.length || sameAddress(args.maker.address, args.denominationAsset?.address))) {
    const investmentAsset = args.holdings?.find((holding) => sameAddress(holding.token?.address, args.maker.address));
    const investmentAmountInDenominationAsset = new BigNumber(args.makerAmount)
      .multipliedBy(investmentAsset?.token?.price || new BigNumber(0))
      .multipliedBy(investmentAsset?.token?.decimals || new BigNumber(18));

    const futureGav = (gav || new BigNumber(0)).plus(investmentAmountInDenominationAsset);
    const futureAssetGav = (investmentAsset?.value || new BigNumber(0)).plus(investmentAmountInDenominationAsset);
    const concentration = futureAssetGav.multipliedBy('1e18').dividedBy(futureGav);

    const valid = !!maxConcentrationPolicies?.every(
      (policy) => policy.maxConcentration && policy.maxConcentration.isGreaterThanOrEqualTo(concentration)
    );

    if (!valid) {
      errors.push('This investment would violate the maximum concentration policy');
    }
  }

  // Price Tolerance Policies
  if (priceTolerancePolicies?.length) {
    const trading = new Trading(args.environment, args.tradingAddress);
    const priceSourceAddress = await trading.getPriceSource();
    const priceSource = new IPriceSource(args.environment, priceSourceAddress);

    const takerQuantity = toTokenBaseUnit(args.takerAmount, args.taker.decimals);
    const makerQuantity = toTokenBaseUnit(args.makerAmount, args.maker.decimals);

    const [referencePrice, orderPrice] = await Promise.all([
      priceSource.getReferencePriceInfo(args.taker.address, args.maker.address),
      priceSource.getOrderPriceInfo(args.taker.address, takerQuantity, makerQuantity),
    ]);

    const valid = priceTolerancePolicies?.every(
      (policy) =>
        policy.priceTolerance &&
        orderPrice.isGreaterThan(
          referencePrice.price.minus(policy.priceTolerance.multipliedBy(referencePrice.price).dividedBy('1e18'))
        )
    );

    if (!valid) {
      errors.push('This investment would violate the price tolerance policy');
    }
  }

  return errors;
};
