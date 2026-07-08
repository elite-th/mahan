import { describe, it, expect } from 'vitest';
import { formatPrice, parseWooCommercePrice } from './formatting';

describe('formatPrice', () => {
  it('formats a numeric price with Persian locale and currency suffix', () => {
    const result = formatPrice(1500000);
    // Persian thousand-separated, default currency "ریال"
    expect(result).toMatch(/ریال$/);
    expect(result).toContain('۱٬۵۰۰٬۰۰۰');
  });

  it('accepts a string price and parses it', () => {
    expect(formatPrice('250000')).toContain('۲۵۰٬۰۰۰');
  });

  it('returns the unknown-price label for null/undefined', () => {
    expect(formatPrice(null as unknown as number)).toBe('قیمت نامشخص');
    expect(formatPrice(undefined as unknown as number)).toBe('قیمت نامشخص');
  });

  it('returns the unknown-price label for non-numeric strings', () => {
    expect(formatPrice('abc')).toBe('قیمت نامشخص');
  });

  it('respects a custom currency label', () => {
    const result = formatPrice(1000, 'تومان');
    expect(result.endsWith('تومان')).toBe(true);
  });

  it('does not show decimal places', () => {
    const result = formatPrice(1234.99);
    expect(result).not.toMatch(/\./);
  });
});

describe('parseWooCommercePrice', () => {
  it('returns 0 for null/undefined/empty input', () => {
    expect(parseWooCommercePrice(null)).toBe(0);
    expect(parseWooCommercePrice(undefined)).toBe(0);
    expect(parseWooCommercePrice('')).toBe(0);
  });

  it('parses a plain numeric string', () => {
    expect(parseWooCommercePrice('500000')).toBe(500000);
  });

  it('strips HTML tags and &nbsp;', () => {
    expect(parseWooCommercePrice('<span>1&nbsp;200&nbsp;000</span>')).toBe(1200000);
  });

  it('converts Persian digits to English', () => {
    expect(parseWooCommercePrice('۱۲۳۴۵۶')).toBe(123456);
  });

  it('removes thousand-separator dots (Iranian Toman format)', () => {
    // In Iranian Toman, dots are thousand separators, NOT decimals.
    expect(parseWooCommercePrice('1.500.000')).toBe(1500000);
  });

  it('strips currency symbols and Persian text', () => {
    expect(parseWooCommercePrice('۲٬۵۰۰٬۰۰۰ ریال')).toBe(2500000);
  });

  it('returns 0 for a string with no digits', () => {
    expect(parseWooCommercePrice('فروش نشده')).toBe(0);
  });
});
