// src/lib/apollo-client-server.ts - Server-side Apollo client for React Server Components (RSC) only.
// Uses WooCommerce API credentials for authentication.
// For API routes, use @/lib/client instead.
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

const createAuthHeaders = (): Record<string, string> => {
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  if (consumerKey && consumerSecret) {
    const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    return { authorization: `Basic ${credentials}` };
  }
  return {};
};

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URI || "https://wordpress.mahan-ic.ir/graphql",
      headers: createAuthHeaders(),
      fetchOptions: {
        next: { revalidate: 300 }, // Default ISR: 5-minute cache for server-side queries
      },
    }),
    // Silence the Apollo 3.14 deprecation warning
    // ("connectToDevTools — Please use `devtools.enabled` instead").
    devtools: { enabled: false },
  });
});