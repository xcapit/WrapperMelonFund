import { sameAddress } from '@melonproject/melonjs';
import React from 'react';
import {
  GiCaesar,
  GiChariot,
  GiIcarus,
  GiMedusaHead,
  GiPadlock,
  GiPalisade,
  GiPegasus,
  GiSpartanHelmet,
  GiStorkDelivery,
  GiWingfoot,
} from 'react-icons/gi';
import { useHistory } from 'react-router';
import { CopyToClipboard } from '~/components/Common/CopyToClipboard/CopyToClipboard';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { TokenValueDisplay } from '~/components/Common/TokenValueDisplay/TokenValueDisplay';
import { Button } from '~/components/Form/Button/Button';
import { RequiresFundSetupComplete } from '~/components/Gates/RequiresFundSetupComplete/RequiresFundSetupComplete';
import { getNetworkName } from '~/config';
import { useConnectionState } from '~/hooks/useConnectionState';
import { useCurrency } from '~/hooks/useCurrency';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useFund } from '~/hooks/useFund';
import { useFundList } from '~/hooks/useFundList';
import { Bar, BarContent } from '~/storybook/Bar/Bar';
import { DataBlock, DataBlockSection } from '~/storybook/DataBlock/DataBlock';
import { Headline } from '~/storybook/Headline/Headline';
import { Tooltip } from '~/storybook/Tooltip/Tooltip';
import { NetworkEnum } from '~/types';
import { useFundSlug } from './FundSlug.query';

export interface FundHeaderProps {
  address: string;
}

export const FundHeader: React.FC<FundHeaderProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const fund = useFund();

  const [slug] = useFundSlug(address);
  const allFunds = useFundList();

  const history = useHistory();
  const connection = useConnectionState();
  const prefix = getNetworkName(connection.network);
  const currency = useCurrency();

  const fundData = allFunds.list.find((item) => sameAddress(item.address, address));

  if (!fundData) {
    return <></>;
  }

  const dailyChange = fundData?.returnSinceYesterday;

  const slugUrl =
    slug &&
    slug + (environment.network > 1 ? `.${NetworkEnum[environment.network].toLowerCase()}.melon.fund` : '.melon.fund');

  const SlugComponent = <CopyToClipboard text={slugUrl} value={`https://${slugUrl}`} />;

  const badges = [];
  fundData?.top5AUM &&
    badges.push(
      <Tooltip key="caesar" value="Top 5 fund by AUM">
        <GiCaesar color="rgb(133,213,202)" size={20} />
      </Tooltip>
    );
  fundData?.top5SinceInception &&
    badges.push(
      <Tooltip key="spartan" value="Top 5 performance since inception">
        <GiSpartanHelmet color="rgb(133,213,202)" size={20} />
      </Tooltip>
    );
  fundData?.top5MTD &&
    badges.push(
      <Tooltip key="pegasus" value="Top 5 performance MTD">
        <GiPegasus color="rgb(133,213,202)" size={20} />
      </Tooltip>
    );
  fundData?.top5Recent &&
    badges.push(
      <Tooltip key="stork" value="5 most recent funds">
        <GiStorkDelivery color="rgb(133,213,202)" size={20} />
      </Tooltip>
    );
  fundData?.top5Investments &&
    badges.push(
      <Tooltip key="chariot" value="5 funds with most investors">
        <GiChariot color="rgb(133,213,202)" size={20} />
      </Tooltip>
    );
  fundData?.largeFund &&
    badges.push(
      <Tooltip key="wingfoot" value="Large fund (> 100 ETH)">
        <GiWingfoot color="rgb(133,213,202)" size={20} />
      </Tooltip>
    );
  fundData?.underperformingFund &&
    badges.push(
      <Tooltip key="icarus" value="Underperforming fund">
        <GiIcarus color="rgb(255,141,136)" size={20} />
      </Tooltip>
    );
  fundData?.tinyFund &&
    badges.push(
      <Tooltip key="medusa" value="Tiny fund (< 1 ETH)">
        <GiMedusaHead color="rgb(255,141,136)" size={20} />
      </Tooltip>
    );
  fundData?.userWhitelist &&
    badges.push(
      <Tooltip key="palisade" value="Fund operates a user whitelist">
        <GiPalisade color="grey" size={20} />
      </Tooltip>
    );
  fundData?.closed &&
    badges.push(
      <Tooltip key="padlock" value="Fund is closed for investment">
        <GiPadlock color="grey" size={20} />
      </Tooltip>
    );

  return (
    <Bar>
      <BarContent justify="between">
        <Headline
          title={
            <span onClick={() => history.push(`/${prefix}/fund/${address}`)} style={{ cursor: 'pointer' }}>
              {fund.name}
            </span>
          }
          text={SlugComponent}
          icon="ETHEREUM"
          badges={badges}
        />
        <RequiresFundSetupComplete fallback={false}>
          <DataBlockSection>
            <DataBlock label="Assets under management">
              <TokenValueDisplay value={fundData?.aum} decimals={0} digits={0} symbol={currency.currency} />
            </DataBlock>

            <DataBlock label="Share price">
              <TokenValueDisplay value={fundData?.sharePrice} decimals={0} symbol={currency.currency} />
            </DataBlock>

            <DataBlock label="Daily change">
              <FormattedNumber value={dailyChange} colorize={true} decimals={2} suffix="%" />
            </DataBlock>

            <Button kind="success" size="large" onClick={() => history.push(`/${prefix}/fund/${address}/invest`)}>
              Invest
            </Button>
          </DataBlockSection>
        </RequiresFundSetupComplete>
      </BarContent>
    </Bar>
  );
};
