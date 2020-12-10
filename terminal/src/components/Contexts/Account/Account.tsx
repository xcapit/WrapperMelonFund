import React, { createContext, useMemo } from 'react';
import { useAccountContextQuery, AccountContext } from './Account.query';
import { useConnectionState } from '~/hooks/useConnectionState';

export interface AccountContextValue extends AccountContext {
  loading: boolean;
  address?: string;
}

export const Account = createContext<AccountContextValue>({
  loading: true,
});

export const AccountProvider: React.FC = (props) => {
  const connection = useConnectionState();
  const [account, query] = useAccountContextQuery(connection.account);
  const output = useMemo(() => ({ ...account, address: connection.account, loading: query.loading }), [
    account,
    query.loading,
    connection.account,
  ]);

  return <Account.Provider value={output}>{props.children}</Account.Provider>;
};
