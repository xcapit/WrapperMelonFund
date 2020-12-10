import React, { useMemo, useEffect, createContext, useRef } from 'react';
import ApolloClient from 'apollo-client';
import { ApolloLink, Observable, FetchResult } from 'apollo-link';
import { RetryLink } from 'apollo-link-retry';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloProvider as BaseApolloProvider } from '@apollo/react-hooks';
import { createSchemaLink, createSchema, createQueryContext } from '@melonproject/melongql';
import { useEnvironment } from '~/hooks/useEnvironment';
import { getConfig } from '~/config';
import { DeployedEnvironment } from '@melonproject/melonjs';
import { NetworkEnum } from '~/types';

const nullLink = new ApolloLink(
  () => new Observable<FetchResult>(() => {})
);

const nullClient = new ApolloClient({
  link: nullLink,
  cache: new InMemoryCache(),
});

export const OnChainApollo = createContext<ApolloClient<NormalizedCacheObject>>(nullClient);
export const TheGraphApollo = createContext<ApolloClient<NormalizedCacheObject>>(nullClient);

const useOnChainApollo = (environment?: DeployedEnvironment) => {
  const schema = useMemo(() => environment && createSchema(environment!), [environment]);
  const apollo = useMemo(() => {
    const data = schema
      ? createSchemaLink({
          schema,
          context: createQueryContext(environment!),
        })
      : nullLink;

    const retry = new RetryLink();
    const link = ApolloLink.from([retry, data]);
    const memory = new InMemoryCache({
      addTypename: true,
    });

    return new ApolloClient({
      link,
      cache: memory,
      defaultOptions: {
        watchQuery: {
          errorPolicy: 'all',
          fetchPolicy: 'no-cache',
        },
        query: {
          errorPolicy: 'all',
          fetchPolicy: 'no-cache',
        },
        mutate: {
          errorPolicy: 'all',
        },
      },
    });
  }, [environment, schema]);

  const apolloRef = useRef<ApolloClient<NormalizedCacheObject>>();
  useEffect(() => {
    apolloRef.current && apolloRef.current.stop();
    apolloRef.current && apolloRef.current.cache.reset();
    apolloRef.current = apollo;
  }, [apollo]);

  return apollo;
};

const useTheGraphApollo = (environment?: DeployedEnvironment) => {
  const client = useMemo(() => {
    // TODO: Fix network enum.
    const network = (environment?.network as any) as undefined | NetworkEnum;
    const config = getConfig(network);
    const subgraph = !!config ? config.subgraph : undefined;
    const data = subgraph
      ? createHttpLink({
          uri: subgraph,
        })
      : nullLink;

    const retry = new RetryLink();
    const link = ApolloLink.from([retry, data]);
    const memory = new InMemoryCache({
      addTypename: true,
    });

    return new ApolloClient({
      link,
      cache: memory,
      defaultOptions: {
        watchQuery: {
          errorPolicy: 'all',
          fetchPolicy: 'no-cache',
        },
        query: {
          errorPolicy: 'all',
          fetchPolicy: 'no-cache',
        },
        mutate: {
          errorPolicy: 'all',
        },
      },
    });
  }, [environment]);

  return client;
};

export const ApolloProvider: React.FC = (props) => {
  const environment = useEnvironment();
  const graph = useTheGraphApollo(environment);
  const chain = useOnChainApollo(environment);

  return (
    <OnChainApollo.Provider value={chain}>
      <TheGraphApollo.Provider value={graph}>
        <BaseApolloProvider client={chain}>{props.children}</BaseApolloProvider>
      </TheGraphApollo.Provider>
    </OnChainApollo.Provider>
  );
};
