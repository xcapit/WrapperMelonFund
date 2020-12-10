import React, { useEffect } from 'react';
import { NotificationBar, NotificationContent } from '~/storybook/NotificationBar/NotificationBar';
import { ShareFundQuery } from '~/components/Routes/Fund/ShareFund/ShareFund.query';
import { Icons } from '~/storybook/Icons/Icons';
import { useLazyOnChainQuery } from '~/hooks/useQuery';
import { useFundSlug } from '../FundHeader/FundSlug.query';
import { useEnvironment } from '~/hooks/useEnvironment';
import { NetworkEnum } from '~/types';

export interface ShareFundProps {
  address: string;
}

export const ShareFund: React.FC<ShareFundProps> = ({ address }) => {
  const [fetch, result] = useLazyOnChainQuery(ShareFundQuery);
  const environment = useEnvironment()!;
  const [slug] = useFundSlug(address);

  const slugUrl =
    slug &&
    slug + (environment.network > 1 ? `.${NetworkEnum[environment.network].toLowerCase()}.melon.fund` : '.melon.fund');

  const onClick = () => {
    if (result.loading) return;

    fetch({
      variables: {
        fund: address,
      },
    });
  };

  useEffect(() => {
    if (!result.data) {
      return;
    }

    const formattedData = {
      name: result.data?.fund?.name,
      managementFee: result.data?.fund?.routes?.feeManager?.managementFee?.rate,
      performanceFee: result.data?.fund?.routes?.feeManager?.performanceFee?.rate,
    };

    const formatedTwitterText = `I just deployed an on-chain fund to @ethereum, powered by @melonprotocol. My fund's name is ${formattedData?.name}, it has a ${formattedData?.managementFee}% management fee, ${formattedData?.performanceFee}% performance fee. Check out its full profile here: https://${slugUrl}.`;

    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(formatedTwitterText)}`);
  }, [result.data]);

  return (
    <NotificationBar kind="neutral">
      <NotificationContent>
        Tell the world about your on-chain investment vehicle{' '}
        <a onClick={onClick}>
          <Icons name="TWITTER" size="small" colored={true} />
        </a>
      </NotificationContent>
    </NotificationBar>
  );
};

export default ShareFund;
