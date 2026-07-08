import React from 'react';

/**
 * JsonLd — Server component that injects a `<script type="application/ld+json">`
 * tag for structured data (schema.org). Used for Organization, Product,
 * FAQPage, and BreadcrumbList schemas to enable Google rich snippets.
 *
 * CSP: the project's script-src policy includes 'unsafe-inline', so these
 * inline scripts are allowed without a nonce.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
