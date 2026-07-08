/**
 * Format price for display
 * WooCommerce typically returns prices as strings in the smallest currency unit
 * For Iranian Rial, prices are usually very large numbers
 * We display them with Persian thousand separators
 * 
 * @param price - The price as a number (should already be in the correct unit from API)
 * @param currency - The currency label to append (default: 'ریال')
 * @returns Formatted price string with Persian numerals and thousand separators
 */
export const formatPrice = (price: number | string, currency: string = 'ریال'): string => {
  // Handle invalid inputs
  if (price === null || price === undefined) {
    return 'قیمت نامشخص';
  }

  // Convert to number if it's a string
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  // Check if conversion was successful
  if (isNaN(numericPrice)) {
    return 'قیمت نامشخص';
  }

  // Format with Persian/Farsi locale and add thousand separators
  // This will use Persian digits and proper thousand separators
  const formattedNumber = numericPrice.toLocaleString('fa-IR', {
    maximumFractionDigits: 0, // No decimal places for currency
    minimumFractionDigits: 0
  });

  return `${formattedNumber} ${currency}`;
};

/**
 * Parse price from WooCommerce GraphQL API
 * WooCommerce price field returns the RAW price as a string
 * 
 * @param priceString - The price string from WooCommerce API
 * @returns Parsed price as number
 */
export const parseWooCommercePrice = (priceString: string | null | undefined): number => {
  if (!priceString) {
    return 0;
  }

  // Remove any HTML tags (like &nbsp;)
  let cleanPrice = priceString.replace(/&nbsp;/g, ' ').replace(/<[^>]*>/g, '');

  // Replace Persian digits with English digits if present
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  for (let i = 0; i < 10; i++) {
    cleanPrice = cleanPrice.replace(new RegExp(persianDigits[i], 'g'), englishDigits[i]);
  }

  // Remove currency symbols and text (Persian/Arabic characters, commas)
  // In Iranian Toman, dots are thousand separators (like 1.500.000), NOT decimal points.
  // So we remove ALL dots, then keep only digits.
  // WooCommerce Toman prices are always integers.
  const withoutSeparators = cleanPrice.replace(/\./g, '');
  const numericString = withoutSeparators.replace(/[^\d]/g, '');

  const price = parseFloat(numericString);

  return isNaN(price) ? 0 : price;
};

/**
 * Noskhan (MNSWMC) meta keys — the WordPress currency-plugin stores the
 * product's USD base price + profit margin in WooCommerce product meta.
 * We read these via GraphQL `metaData { key value }`.
 */
const NOSKHAN_META = {
  regularPriceUsd: '_mnswmc_regular_price',
  salePriceUsd: '_mnswmc_sale_price',
  active: '_mnswmc_active',
  profitMargin: '_mnswmc_profit_margin',
} as const;

/** Raw meta entry shape returned by GraphQL. */
interface MetaEntry {
  key: string;
  value: string | null;
}

/**
 * Extract the Noskhan USD price from a product's metaData array.
 *
 * @returns the USD price as a number, or `null` if the product has no
 *          USD price (e.g. noskhan not active, or price is zero/empty).
 */
export function extractUsdPrice(metaData: MetaEntry[] | null | undefined): number | null {
  if (!metaData || !Array.isArray(metaData)) return null;

  // Strip the "متها: " (Persian "meta:") prefix that WPGraphQL adds to meta keys
  const normalize = (k: string) => k.replace(/^.*?:\s*/, '');

  const active = metaData.find((m) => normalize(m.key) === NOSKHAN_META.active);
  if (active?.value !== 'yes') return null;

  const usdPriceEntry = metaData.find((m) => normalize(m.key) === NOSKHAN_META.regularPriceUsd);
  if (!usdPriceEntry?.value) return null;

  const usd = parseFloat(usdPriceEntry.value);
  if (isNaN(usd) || usd <= 0) return null;

  return usd;
}

/**
 * Format a USD price for display.
 *
 * @param usd - the USD price (e.g. 4300)
 * @returns formatted string with Persian digits, e.g. "۴,۳۰۰ دلار"
 */
export function formatUsdPrice(usd: number): string {
  const formatted = usd.toLocaleString('fa-IR', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  return `${formatted} دلار`;
}

/**
 * Calculate the USD price per unit (for display in cart/checkout).
 * Currently a 1:1 mapping — kept as a function so future per-unit logic
 * (e.g. price-per-meter for cabling) can plug in here.
 */
export function usdPricePerUnit(usd: number, _unit?: string): string {
  return formatUsdPrice(usd);
}