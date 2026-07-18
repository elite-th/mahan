// src/lib/apollo-wrapper.tsx - Client-side Apollo provider for the app.
// Auth is handled via httpOnly cookies through the /api/graphql proxy.
// Includes an onError link that auto-refreshes JWT on authentication errors.
"use client";

import React from "react";
import { ApolloLink, HttpLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { fromPromise, Observable } from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";

// Module-level state for Apollo auth refresh deduplication and retry guard.
// This prevents: (1) multiple concurrent refresh requests, and (2) infinite retry loops.
let apolloRefreshPromise: Promise<boolean> | null = null;
let isApolloRetrying = false;

function makeClient() {
  const httpLink = new HttpLink({
    // Client-side: use our GraphQL proxy (which adds auth from httpOnly cookies)
    // Server-side: use direct WordPress GraphQL endpoint
    uri: typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_GRAPHQL_URI || "https://wordpress.mahan-ic.ir/graphql"
      : "/api/graphql",
    credentials: "include", // Send cookies with client-side requests
  });

  // Error link that auto-refreshes JWT on authentication errors.
  // When a GraphQL error with category 'authentication' is detected,
  // we call /api/auth/refresh and retry the operation ONCE.
  // Protection against infinite loops: isApolloRetrying flag ensures
  // we only retry once per auth error cycle.
  const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    if (
      graphQLErrors?.some(e => e.extensions?.category === 'authentication') &&
      !isApolloRetrying
    ) {
      isApolloRetrying = true;

      // Deduplicate refresh requests — if multiple queries fail with 401,
      // they all share the same refresh promise (same pattern as authFetch).
      if (!apolloRefreshPromise) {
        apolloRefreshPromise = fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
          .then(res => res.ok)
          .finally(() => { apolloRefreshPromise = null; });
      }

      return fromPromise<boolean>(apolloRefreshPromise).flatMap(ok => {
        isApolloRetrying = false;
        if (ok) {
          return forward(operation);
        }
        // Refresh failed — redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        // Return empty observable to prevent subscribers from hanging
        return new Observable(subscriber => {
          subscriber.complete();
        });
      });
    }
  });

  const link = typeof window === "undefined"
    ? ApolloLink.from([
      new SSRMultipartLink({
        stripDefer: true,
      }),
      httpLink,
    ])
    : ApolloLink.from([errorLink, httpLink]);

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: link,
    // Devtools disabled to silence the Apollo 3.14 deprecation warning
    // ("connectToDevTools — Please use `devtools.enabled` instead").
    // Re-enable in development if you need the Apollo devtools panel.
    devtools: { enabled: false },
  });
}

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
