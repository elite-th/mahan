import { logger } from '@/lib/logger';

/**
 * Environment variable validation for server startup.
 *
 * Validates that all required environment variables are present before
 * the application starts serving requests. Missing variables are collected
 * and reported together (fail-fast with clear diagnostics).
 *
 * Called from instrumentation.ts on Next.js server startup.
 *
 * Architecture note (Rule #9): Extensible via the REQUIRED_VARS array —
 * add new entries to support additional environment variables without
 * modifying the validation logic.
 */

/** Describes a required environment variable */
export interface RequiredEnvVar {
    /** The environment variable name */
    name: string;
    /** Human-readable description (used in error messages) */
    description: string;
    /** Alternative variable name that satisfies the requirement (e.g., sandbox variant) */
    alternative?: string;
}

/**
 * Required environment variables for the ماهان catalog-only site.
 *
 * Catalog mode: only WooCommerce REST + GraphQL are needed to fetch and
 * display products. User auth, cart, and payment are disabled, so
 * WP_APP_*, ZIBAL_MERCHANT, etc. are NOT required.
 */
export const REQUIRED_VARS: RequiredEnvVar[] = [
    {
        name: 'WOOCOMMERCE_CONSUMER_KEY',
        description: 'کلید مصرف‌کننده ووکامرس (WooCommerce Consumer Key)',
    },
    {
        name: 'WOOCOMMERCE_CONSUMER_SECRET',
        description: 'رمز مصرف‌کننده ووکامرس (WooCommerce Consumer Secret)',
    },
    {
        name: 'NEXT_PUBLIC_GRAPHQL_URI',
        description: 'آدرس GraphQL وردپرس (WordPress GraphQL URI)',
    },
    {
        name: 'NEXT_PUBLIC_WP_API_URL',
        description: 'آدرس API وردپرس (WordPress REST API URL — used for product images)',
        alternative: 'NEXT_PUBLIC_API_BASE_URL',
    },
];

/**
 * Validate all required environment variables.
 *
 * Checks each variable in REQUIRED_VARS — if neither the primary name
 * nor its alternative (if any) is set, it's recorded as missing.
 *
 * @returns An object with:
 *   - `valid`: true if all required vars are present
 *   - `missing`: array of missing var descriptions
 *   - `missingNames`: array of missing var names (for logging)
 */
export function validateEnv(): {
    valid: boolean;
    missing: string[];
    missingNames: string[];
} {
    const missing: string[] = [];
    const missingNames: string[] = [];

    for (const varDef of REQUIRED_VARS) {
        const hasPrimary = !!process.env[varDef.name];
        const hasAlternative = varDef.alternative ? !!process.env[varDef.alternative] : false;

        if (!hasPrimary && !hasAlternative) {
            let message = `${varDef.name} (${varDef.description})`;
            if (varDef.alternative) {
                message += ` — یا ${varDef.alternative}`;
            }
            missing.push(message);
            missingNames.push(varDef.name);
        }
    }

    return {
        valid: missing.length === 0,
        missing,
        missingNames,
    };
}

/**
 * Validate environment variables and throw a descriptive error if any are missing.
 *
 * This is the main entry point called from instrumentation.ts.
 * Only runs on the Node.js server runtime (not Edge).
 */
export function validateEnvOrThrow(): void {
    const result = validateEnv();

    if (!result.valid) {
        const errorMessage = [
            '⛔ متغیرهای محیطی ضروری تنظیم نشده‌اند:',
            '',
            ...result.missing.map((m) => `  • ${m}`),
            '',
            'لطفاً فایل .env.local را بررسی کنید و متغیرهای فوق را اضافه نمایید.',
            'برای راهنمایی، فایل .env.local.example را مطالعه کنید.',
        ].join('\n');

        logger.error(errorMessage);
        throw new Error(
            `Missing required environment variables: ${result.missingNames.join(', ')}. ` +
            'Check server logs for details.'
        );
    }

    logger.info('Environment variable validation passed — all required vars are set.');
}
