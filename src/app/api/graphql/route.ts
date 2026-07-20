import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { withRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limiter';
import { fetchWithTimeout } from '@/lib/fetch-with-timeout';
import { logger } from '@/lib/logger';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_URI || 'http://localhost:8080/graphql';

export const POST = withRateLimit(
    async (request: Request) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('vira_auth_token')?.value;

        // Read the GraphQL request body from the client
        const body = await request.json();

        // Build headers for WordPress GraphQL
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        // If we have a JWT from httpOnly cookie, add it as Bearer auth
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Add WooCommerce consumer key/secret as Basic auth fallback
        const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
        const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
        if (consumerKey && consumerSecret && !token) {
            const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
            headers['Authorization'] = `Basic ${credentials}`;
        }

        // Forward the request to WordPress GraphQL
        const graphqlResponse = await fetchWithTimeout(GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        }, 15000); // 15s timeout for GraphQL proxy

        const data = await graphqlResponse.json();

        if (!graphqlResponse.ok) {
            return NextResponse.json(
                { errors: [{ message: 'خطا در ارتباط با سرور.' }] },
                { status: graphqlResponse.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            return NextResponse.json(
                { errors: [{ message: 'زمان پاسخگویی سرور به پایان رسید. لطفاً دوباره تلاش کنید.' }] },
                { status: 504 }
            );
        }
        logger.error('GraphQL proxy error', undefined, error instanceof Error ? error : undefined);
        return NextResponse.json(
            { errors: [{ message: 'خطای داخلی سرور. لطفاً بعداً تلاش کنید.' }] },
            { status: 500 }
        );
    }
},
RATE_LIMIT_PRESETS.default,
'graphql-proxy'
);
