/**
 * Edge Runtime Instrumentation Hook (empty)
 *
 * Next.js runs instrumentation.ts in BOTH Node.js and Edge runtimes.
 * The Node.js version validates environment variables, but Edge runtime
 * does not support dynamic imports or code generation from strings.
 *
 * This file provides a no-op register() for the Edge runtime to prevent:
 *   EvalError: Code generation from strings disallowed for this context
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // No-op: Edge runtime does not need env validation.
  // The Node.js runtime handles that in instrumentation.ts
}
