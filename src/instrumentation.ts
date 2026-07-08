/**
 * Next.js Instrumentation Hook
 *
 * Runs once on server startup (Node.js runtime only) to validate
 * environment variables and perform other initialization tasks.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
    // Only run on the Node.js server runtime (not Edge)
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { validateEnvOrThrow } = await import('./lib/env-validation');
        validateEnvOrThrow();
    }
}
