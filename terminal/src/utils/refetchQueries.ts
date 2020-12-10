import ApolloClient, { ObservableQuery } from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';

export function refetchQueries(client: ApolloClient<NormalizedCacheObject>, block?: number, names?: string[]) {
  const refetch: ObservableQuery[] = [];
  const manager = client.queryManager as any;
  (manager.queries as Map<any, any>).forEach((query) => {
    const observable = query.observableQuery as ObservableQuery;
    if (!names || (observable && observable.queryName && names.includes(observable.queryName))) {
      refetch.push(observable);
    }
  });

  return Promise.all(
    refetch.map((query) => {
      return query.refetch({
        ...query.variables,
        ...(block && { block }),
      });
    })
  );
}
