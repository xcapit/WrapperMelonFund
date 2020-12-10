import React from 'react';
import { useHistory } from 'react-router';
import { Fund } from '~/components/Routes/Wallet/WalletOverview/FundParticipationOverview.query';
import { BodyCell, BodyRowHover, BodyCellRightAlign } from '~/storybook/Table/Table';
import { FormattedDate } from '~/components/Common/FormattedDate/FormattedDate';
import { TokenValueDisplay } from '~/components/Common/TokenValueDisplay/TokenValueDisplay';
import { getNetworkName } from '~/config';
import { useConnectionState } from '~/hooks/useConnectionState';

export interface WalletOverviewManagedFundProps {
  fund?: Fund;
  version?: {
    address: string;
    name: string;
  };
}

export const WalletOverviewManagedFund: React.FC<WalletOverviewManagedFundProps> = ({ fund, version }) => {
  const history = useHistory();
  const connection = useConnectionState();
  const prefix = getNetworkName(connection.network);

  return (
    <BodyRowHover onClick={() => history.push(`/${prefix}/fund/${fund?.address}`)}>
      <BodyCell>{fund?.name}</BodyCell>
      <BodyCell>
        <FormattedDate timestamp={fund?.inception} />
      </BodyCell>
      <BodyCellRightAlign>
        <TokenValueDisplay value={fund?.gav} />
      </BodyCellRightAlign>
      <BodyCellRightAlign>
        <TokenValueDisplay value={fund?.sharePrice} />
      </BodyCellRightAlign>
      <BodyCellRightAlign>{fund?.change.toFixed(2)}%</BodyCellRightAlign>
      <BodyCellRightAlign>
        <TokenValueDisplay value={fund?.shares} />
      </BodyCellRightAlign>
      <BodyCell>
        {fund?.version} {fund?.version === version?.name ? '(current)' : '(old)'}
      </BodyCell>
      <BodyCell>{fund?.isShutDown ? 'Inactive' : 'Active'}</BodyCell>
    </BodyRowHover>
  );
};
