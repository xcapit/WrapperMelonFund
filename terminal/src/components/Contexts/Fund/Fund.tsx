import React, { createContext, useMemo } from 'react';
import { useFundContextQuery, FundContext } from './Fund.query';
import { toChecksumAddress, isAddress } from 'web3-utils';
import { Spinner } from '~/storybook/Spinner/Spinner';
import { Container } from '~/storybook/Container/Container';
import { Fallback } from '~/components/Common/Fallback/Fallback';

export interface FundContextValue extends FundContext {
  loading: boolean;
  address?: string;
}

export interface FundProviderProps {
  address: string;
}

export const Fund = createContext<FundContextValue>({
  loading: true,
});

export const FundProvider: React.FC<FundProviderProps> = (props) => {
  const address = isAddress(props.address) ? toChecksumAddress(props.address) : undefined;
  const [fund, query] = useFundContextQuery({
    variables: address ? { address } : {},
    skip: !address,
  });

  const output = useMemo(() => ({ ...fund, address, loading: query.loading }), [fund, query.loading]);
  if (query.loading) {
    return <Spinner />;
  }

  if (query.error) {
    return (
      <Container>
        <Fallback>Failed to load fund details. Please try again.</Fallback>
      </Container>
    );
  }

  if (!fund.address) {
    return (
      <Container>
        <Fallback>This fund does not exist. Are you connected to the right network?</Fallback>
      </Container>
    );
  }

  return <Fund.Provider value={output}>{props.children}</Fund.Provider>;
};
