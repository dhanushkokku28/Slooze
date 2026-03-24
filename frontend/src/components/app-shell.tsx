"use client";

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { ApolloProvider } from "@apollo/client/react";
import { ReactNode, useMemo } from "react";

type AppShellProps = {
  children: ReactNode;
  userId: string | undefined;
};

export function AppShell({ children, userId }: AppShellProps) {
  const client = useMemo(() => {
    return new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:4000/graphql",
        headers: userId
          ? {
              "x-user-id": userId,
            }
          : undefined,
      }),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "cache-and-network",
        },
      },
    });
  }, [userId]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
