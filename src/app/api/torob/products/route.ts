import { NextRequest, NextResponse } from 'next/server';
import { SITE_URL } from '@/constants';
import { logger } from '@/lib/logger';
import { fetchProductImagesFromRest, enrichProductsWithImages } from '@/lib/product-images';

/**
 * Torob API v3 — Product feed endpoint.
 *
 * Implements the Torob API v3 specification for product synchronization.
 * Torob crawls this endpoint to index products for price comparison.
 *
 * Endpoint: POST /api/torob/products/
 *
 * Security: Torob sends a JWT in the X-Torob-Token header. Verification
 * is optional for now (set TOROB_VERIFY_JWT=true to enforce).
 */

const TOROB_API_VERSION = 'torob_api_v3';
const PRODUCTS_PER_PAGE = 100;
const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URI || 'http://localhost:8080/graphql';

// ---------------------------------------------------------------------------
// GraphQL query — fetches all published products via direct fetch (not Apollo
// RSC client, which doesn't work in API route handlers).
// ---------------------------------------------------------------------------
const PRODUCTS_QUERY = `
  query GetAllProductsForTorob {
    products(first: 1000, where: { status: "PUBLISH" }) {
      nodes {
        databaseId
        name
        slug
        date
        modified
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
          sku
          stockStatus
        }
        ... on VariableProduct {
          price
          regularPrice
          salePrice
          sku
          stockStatus
        }
        image {
          sourceUrl
          altText
        }
        galleryImages {
          nodes {
            sourceUrl
            altText
          }
        }
        productCategories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Parse WooCommerce price string → integer (Rial). */
function parsePrice(priceStr: string | null | undefined): number {
  if (!priceStr) return 0;
  const cleaned = priceStr
    .replace(/&nbsp;/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\./g, '')
    .replace(/[^\d]/g, '');
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 0 : num;
}

/** Decode a URL-encoded slug to readable Persian text. */
function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

interface TorobProduct {
  page_unique: string;
  page_url: string;
  product_group_id?: string | null;
  title: string;
  subtitle?: string | null;
  current_price: number;
  old_price?: number | null;
  availability: boolean;
  category_name?: string | null;
  image_links: string[];
  spec: Record<string, string>;
  guarantee?: string | null;
  short_desc?: string | null;
  date_added: string;
  date_updated: string;
}

/** Transform a WooCommerce product node → Torob product format. */
function toTorobProduct(wp: any): TorobProduct {
  const price = parsePrice(wp.price);
  const regularPrice = parsePrice(wp.regularPrice);
  const salePrice = wp.salePrice ? parsePrice(wp.salePrice) : null;

  const oldPrice = salePrice && salePrice > 0 && regularPrice > salePrice
    ? regularPrice
    : null;

  const imageLinks: string[] = [];
  if (wp.image?.sourceUrl) {
    imageLinks.push(wp.image.sourceUrl);
  }
  if (wp.galleryImages?.nodes) {
    for (const img of wp.galleryImages.nodes) {
      if (img?.sourceUrl && !imageLinks.includes(img.sourceUrl)) {
        imageLinks.push(img.sourceUrl);
      }
    }
  }

  const category = wp.productCategories?.nodes?.[0]?.name || null;

  const dateAdded = wp.date || new Date().toISOString();
  const dateUpdated = wp.modified || dateAdded;

  return {
    page_unique: String(wp.databaseId),
    page_url: `${SITE_URL}/product/${decodeSlug(wp.slug)}/`,
    title: wp.name,
    subtitle: null,
    current_price: price,
    old_price: oldPrice,
    availability: wp.stockStatus === 'IN_STOCK',
    category_name: category,
    image_links: imageLinks,
    spec: {},
    guarantee: null,
    short_desc: null,
    date_added: dateAdded,
    date_updated: dateUpdated,
  };
}

/** Fetch all products from WooCommerce GraphQL via direct fetch. */
async function fetchAllProducts(): Promise<any[]> {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: PRODUCTS_QUERY }),
    next: { revalidate: 300 }, // Cache 5 minutes
  });

  if (!response.ok) {
    logger.error('Torob: GraphQL fetch failed', { status: response.status });
    throw new Error(`GraphQL fetch failed: ${response.status}`);
  }

  const json = await response.json();
  let products = json?.data?.products?.nodes ?? [];

  // Enrich with REST API images (fallback for CSV-imported products)
  if (products.length > 0) {
    const imageMap = await fetchProductImagesFromRest();
    products = enrichProductsWithImages(products, imageMap);
  }

  return products;
}

// ---------------------------------------------------------------------------
// JWT verification (optional)
// ---------------------------------------------------------------------------
async function verifyTorobToken(request: NextRequest): Promise<boolean> {
  const enforce = process.env.TOROB_VERIFY_JWT === 'true';
  if (!enforce) return true;

  const token = request.headers.get('X-Torob-Token');
  if (!token) {
    logger.warn('Torob: missing X-Torob-Token header');
    return false;
  }

  // TODO: implement full JWT verification with Torob's public key
  logger.info('Torob: JWT token received (verification not yet implemented)');
  return true;
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  const authOk = await verifyTorobToken(request);
  if (!authOk) {
    return NextResponse.json(
      { error: 'Unauthorized: invalid or missing token' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    // Type 1: paginated list (page + sort)
    if ('page' in body && 'sort' in body) {
      return await handlePaginatedList(body.page, body.sort);
    }

    // Type 2: specific products by URL
    if ('page_urls' in body) {
      return await handlePageUrls(body.page_urls);
    }

    // Type 3: specific products by unique ID
    if ('page_uniques' in body) {
      return await handlePageUniques(body.page_uniques);
    }

    return NextResponse.json(
      { error: 'Invalid request: must provide (page + sort), page_urls, or page_uniques' },
      { status: 400 }
    );
  } catch (error) {
    logger.error('Torob API: internal error', undefined, error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Request handlers
// ---------------------------------------------------------------------------

async function handlePaginatedList(page: unknown, sort: unknown) {
  if (typeof page !== 'number' || page < 1 || !Number.isInteger(page)) {
    return NextResponse.json(
      { error: 'page must be a positive integer' },
      { status: 400 }
    );
  }

  if (sort !== 'date_added_desc' && sort !== 'date_updated_desc') {
    return NextResponse.json(
      { error: 'sort must be "date_added_desc" or "date_updated_desc"' },
      { status: 400 }
    );
  }

  const allProducts = await fetchAllProducts();

  const sorted = [...allProducts];
  if (sort === 'date_added_desc') {
    sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } else {
    sorted.sort((a, b) =>
      new Date(b.modified || b.date).getTime() - new Date(a.modified || a.date).getTime()
    );
  }

  const total = sorted.length;
  const maxPages = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE));
  const startIdx = (page - 1) * PRODUCTS_PER_PAGE;
  const pageProducts = sorted.slice(startIdx, startIdx + PRODUCTS_PER_PAGE);

  return NextResponse.json({
    api_version: TOROB_API_VERSION,
    current_page: page,
    total,
    max_pages: maxPages,
    products: pageProducts.map(toTorobProduct),
  });
}

async function handlePageUrls(urls: unknown) {
  if (!Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json(
      { error: 'page_urls must be a non-empty list of strings' },
      { status: 400 }
    );
  }

  const allProducts = await fetchAllProducts();
  const urlSet = new Set(urls as string[]);

  const matched = allProducts.filter((p) =>
    urlSet.has(`${SITE_URL}/product/${decodeSlug(p.slug)}/`)
  );

  return NextResponse.json({
    api_version: TOROB_API_VERSION,
    current_page: 1,
    total: matched.length,
    max_pages: 1,
    products: matched.map(toTorobProduct),
  });
}

async function handlePageUniques(uniques: unknown) {
  if (!Array.isArray(uniques) || uniques.length === 0) {
    return NextResponse.json(
      { error: 'page_uniques must be a non-empty list of strings' },
      { status: 400 }
    );
  }

  const allProducts = await fetchAllProducts();
  const idSet = new Set((uniques as string[]).map(String));

  const matched = allProducts.filter((p) => idSet.has(String(p.databaseId)));

  return NextResponse.json({
    api_version: TOROB_API_VERSION,
    current_page: 1,
    total: matched.length,
    max_pages: 1,
    products: matched.map(toTorobProduct),
  });
}
