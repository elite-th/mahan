import { NextResponse } from 'next/server';

/**
 * Health Check Endpoint
 *
 * Used by container orchestrators (Kubernetes, Docker, etc.)
 * to verify the application is alive and functional.
 *
 * Checks:
 * 1. Basic liveness (process is running)
 * 2. WordPress REST API connectivity
 * 3. WordPress GraphQL connectivity
 * 4. Environment variables are configured
 *
 * IMPORTANT: This endpoint does NOT have rate limiting —
 * health checks are called frequently by orchestrators.
 */
export async function GET() {
  const checks: Record<string, { status: 'ok' | 'error'; latencyMs?: number; error?: string }> = {};
  let overallStatus = 'ok';

  // Check 1: Environment variables
  const hasWcKey = !!process.env.WOOCOMMERCE_CONSUMER_KEY;
  const hasWcSecret = !!process.env.WOOCOMMERCE_CONSUMER_SECRET;
  const hasGraphqlUri = !!process.env.NEXT_PUBLIC_GRAPHQL_URI;
  const hasZibal = !!process.env.ZIBAL_MERCHANT;

  checks.env = {
    status: (hasWcKey && hasWcSecret && hasGraphqlUri && hasZibal) ? 'ok' : 'error',
    error: (!hasWcKey || !hasWcSecret || !hasGraphqlUri || !hasZibal)
      ? `Missing: ${[
          !hasWcKey && 'WOOCOMMERCE_CONSUMER_KEY',
          !hasWcSecret && 'WOOCOMMERCE_CONSUMER_SECRET',
          !hasGraphqlUri && 'NEXT_PUBLIC_GRAPHQL_URI',
          !hasZibal && 'ZIBAL_MERCHANT',
        ].filter(Boolean).join(', ')}`
      : undefined,
  };

  // Check 2: WordPress REST API connectivity
  // Uses /wp/v2/posts (public endpoint) instead of /wp/v2/system-status (admin-only, may not exist)
  const wpBaseUrl = process.env.NEXT_PUBLIC_WP_API_URL || 'http://localhost:8080/wp-json';
  try {
    const start = Date.now();
    const response = await fetch(`${wpBaseUrl}/wp/v2/posts?per_page=1`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5s timeout
    });
    checks.wordpressRest = {
      status: response.ok || response.status === 401 ? 'ok' : 'error', // 401 means API is reachable but needs auth
      latencyMs: Date.now() - start,
      error: (!response.ok && response.status !== 401) ? `HTTP ${response.status}` : undefined,
    };
  } catch (error) {
    checks.wordpressRest = {
      status: 'error',
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }

  // Check 3: WordPress GraphQL connectivity
  const graphqlUri = process.env.NEXT_PUBLIC_GRAPHQL_URI || 'http://localhost:8080/graphql';
  try {
    const start = Date.now();
    const response = await fetch(graphqlUri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ __typename }' }),
      signal: AbortSignal.timeout(5000),
    });
    checks.wordpressGraphql = {
      status: response.ok ? 'ok' : 'error',
      latencyMs: Date.now() - start,
      error: !response.ok ? `HTTP ${response.status}` : undefined,
    };
  } catch (error) {
    checks.wordpressGraphql = {
      status: 'error',
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }

  // Determine overall status
  const hasError = Object.values(checks).some(c => c.status === 'error');
  overallStatus = hasError ? 'error' : 'ok';

  return NextResponse.json(
    {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      service: 'vira-store',
      version: process.env.npm_package_version || '1.0.0',
      checks,
    },
    { status: hasError ? 503 : 200 }
  );
}
