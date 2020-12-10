import { sameAddress } from '@melonproject/melonjs';
import BigNumber from 'bignumber.js';
import { range } from 'ramda';
import React, { Fragment } from 'react';
import { EtherscanLink } from '~/components/Common/EtherscanLink/EtherscanLink';
import { FormattedDate } from '~/components/Common/FormattedDate/FormattedDate';
import { useFundCalculationHistoryQuery } from '~/components/Routes/Fund/FundDiligence/FundFactSheet/FundCalculationHistory.query';
import { useAccount } from '~/hooks/useAccount';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Block } from '~/storybook/Block/Block';
import { DictionaryData, DictionaryDivider, DictionaryEntry, DictionaryLabel } from '~/storybook/Dictionary/Dictionary';
import { Spinner } from '~/storybook/Spinner/Spinner';
import { NetworkEnum } from '~/types';
import { useFundSlug } from '../../FundHeader/FundSlug.query';
import { useFundDetailsQuery } from '../FundDetails.query';

export interface NormalizedCalculation {
  sharePrice: BigNumber;
  dailyReturn: number;
  logReturn: number;
  timestamp: number;
}

export interface FundFactSheetProps {
  address: string;
}

export const numberPadding = (digits: number, maxDigits: number) => {
  return range(0, maxDigits - digits)
    .map(() => String.fromCharCode(160))
    .join('');
};

export const FundFactSheet: React.FC<FundFactSheetProps> = ({ address }) => {
  const [fund, fundQuery] = useFundDetailsQuery(address);
  const environment = useEnvironment()!;
  const account = useAccount();
  const [calculations, calculationsQuery] = useFundCalculationHistoryQuery(address);
  const [slug] = useFundSlug(address);

  if (!fundQuery || fundQuery.loading || !calculationsQuery || calculationsQuery.loading) {
    return (
      <>
        <Spinner />
      </>
    );
  }

  if (!fund) {
    return null;
  }

  const isManager = sameAddress(fund.manager, account.address);

  const slugUrl =
    slug &&
    slug + (environment.network > 1 ? `.${NetworkEnum[environment.network].toLowerCase()}.melon.fund` : '.melon.fund');

  const routes = fund.routes;
  const accounting = routes?.accounting;
  const shares = routes?.shares;
  const creation = fund.creationTime;

  const lastPriceUpdate = calculations && calculations[calculations.length - 1].timestamp;

  const gavDigitsRaw = accounting?.grossAssetValue.integerValue().toString().length || 0;
  const gavDigits = gavDigitsRaw + Math.floor(gavDigitsRaw / 3);

  const navDigitsRaw = accounting?.netAssetValue.integerValue().toString().length || 0;
  const navDigits = navDigitsRaw + Math.floor(navDigitsRaw / 3);

  const sharesDigitsRaw = shares?.totalSupply.integerValue().toString().length || 0;
  const sharesDigits = sharesDigitsRaw + Math.floor(sharesDigitsRaw / 3);

  const sharePriceDigitsRaw = accounting?.sharePrice.integerValue().toString().length || 0;
  const sharePriceDigits = sharePriceDigitsRaw + Math.floor(sharePriceDigitsRaw / 3);

  const maxDigits = Math.max(gavDigits, navDigits, sharesDigits, sharePriceDigits);

  const exchanges = routes?.trading?.exchanges
    ?.map((exchange) => environment?.getExchange(exchange as any))
    .filter((item) => !!item)
    .sort((a, b) => {
      if (a.historic === b.historic) {
        return 0;
      }

      return a.historic ? 1 : -1;
    })
    .filter((item, index, array) => {
      const found = array.findIndex((inner) => sameAddress(item.exchange, inner.exchange));
      return found >= index;
    });

  const allowedAssets = routes?.participation?.allowedAssets;
  const allowedAssetsSymbols = allowedAssets?.map((asset) => asset?.token?.symbol);
  const version = routes?.version;

  return (
    <Block>
      <DictionaryEntry>
        <DictionaryLabel>Fund name</DictionaryLabel>
        <DictionaryData>{fund.name}</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Inception</DictionaryLabel>
        <DictionaryData>{creation ? <FormattedDate timestamp={creation} /> : 'N/A'}</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Status</DictionaryLabel>
        <DictionaryData>{fund.isShutDown ? 'Inactive' : 'Active'}</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Protocol version</DictionaryLabel>
        <DictionaryData>{version?.name ? version.name : 'N/A'}</DictionaryData>
      </DictionaryEntry>
      <DictionaryDivider />
      <DictionaryEntry>
        <DictionaryLabel>Authorized exchanges</DictionaryLabel>
        <DictionaryData>
          {exchanges?.map((item, index) => (
            <Fragment key={item.id}>
              <EtherscanLink key={index} inline={true} address={item.adapter}>
                {item.name}
              </EtherscanLink>
              {index + 1 < exchanges.length && ', '}
            </Fragment>
          ))}
        </DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Investable assets</DictionaryLabel>
        <DictionaryData>{allowedAssetsSymbols ? allowedAssetsSymbols.sort().join(', ') : 'N/A'}</DictionaryData>
      </DictionaryEntry>
    </Block>
  );
};

// <TwitterLink
// text={
//   isManager
//     ? `Check out my on-chain fund on Melon "${fund.name}" deployed to @ethereum and powered by @melonprotocol on https://${slugUrl}.`
//     : `Check out this interesting on-chain fund on Melon "${fund.name}" deployed to @ethereum and powered by @melonprotocol on https://${slugUrl}.`
// }
// />
