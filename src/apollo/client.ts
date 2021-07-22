import { ApolloClient } from "apollo-client";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";

/**
 * pair data client
 * */
export const quickSwapGraphClient: ApolloClient<NormalizedCacheObject> = new ApolloClient(
  {
    link: new HttpLink({
      uri: "https://api.thegraph.com/subgraphs/name/sameepsi/quickswap"
    }),
    cache: new InMemoryCache()
  }
);

/**
 * block client
 * */
export const polygonBlockClient: ApolloClient<NormalizedCacheObject> = new ApolloClient(
  {
    link: new HttpLink({
      uri:
        "https://api.thegraph.com/subgraphs/name/matthewlilley/polygon-blocks"
    }),
    cache: new InMemoryCache()
  }
);
