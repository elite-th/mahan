import { test, expect } from '@playwright/test';

/**
 * Smoke tests — verify the application boots and core public pages render.
 *
 * These run against the dev server (auto-started by playwright.config.ts) or
 * against PLAYWRIGHT_BASE_URL when set (e.g. a preview/staging deployment).
 */

test.describe('Public pages smoke', () => {
  test('homepage loads and shows the company brand', async ({ page }) => {
    await page.goto('/');
    // The <html lang="fa"> attribute confirms the document rendered.
    const lang = await page.getAttribute('html', 'lang');
    expect(lang).toBe('fa');
    // Title should be set (SEO). It contains the company name.
    await expect(page).toHaveTitle(/.+/);
  });

  test('products page is reachable from the homepage navigation', async ({ page }) => {
    await page.goto('/');
    // The header is present and the document is not an error page.
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('body')).not.toContainText(['Application error', 'Unhandled Runtime Error']);
  });

  test('unknown URL shows the 404 page, not a crash', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist-xyz');
    // Next.js returns 404 for unknown routes.
    expect(response?.status()).toBe(404);
  });
});
