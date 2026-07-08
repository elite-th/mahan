import '@testing-library/jest-dom/vitest';

/**
 * Vitest global setup.
 *
 * jest-dom matchers (toBeInTheDocument, toHaveTextContent, etc.) are available
 * in every test file without importing.
 *
 * NOTE: jsdom does not implement IntersectionObserver or matchMedia, which are
 * used by some components. We install minimal stubs so tests that render those
 * components don't throw.
 */
if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    window.matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }

  if (!window.IntersectionObserver) {
    window.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    } as unknown as typeof IntersectionObserver;
  }
}
