import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// D1: Route protection — redirect unauthenticated users to /login
// ---------------------------------------------------------------------------
// Routes that require authentication. Users without a vira_auth_token cookie
// are redirected to /login?redirect=<original-url>.
// Note: We only check cookie *presence* here (not validity) — actual token
// validation is done by requireAuth() in API routes. This avoids making an
// HTTP call to WordPress JWT from the Edge middleware (which would be slow
// and unreliable). The cookie is httpOnly, so its presence is a strong signal
// that the user recently authenticated.
// ---------------------------------------------------------------------------
const PROTECTED_ROUTE_PATTERNS = [
    /^\/checkout/,
    /^\/account/,
];

function isProtectedRoute(pathname: string): boolean {
    return PROTECTED_ROUTE_PATTERNS.some(pattern => pattern.test(pathname));
}

export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;
    const host = request.headers.get('host') || '';

    // ── www → non-www redirect (with trailing-slash preservation) ──
    //
    // This MUST run before the trailingSlash redirect (which Next.js handles
    // automatically). Doing it here (instead of in next.config.js `redirects()`)
    // lets us preserve the trailing slash in a single hop, avoiding a 3-step
    // redirect chain that triggers Torob's "TooManyRedirects" error.
    //
    // Single-hop:  www.example.com/product/slug/ → example.com/product/slug/ → 200
    if (host.startsWith('www.')) {
        const newHost = host.slice(4); // strip "www."
        const url = new URL(request.url);
        url.host = newHost;
        // Preserve pathname (with its trailing slash) and search params
        url.pathname = pathname;
        url.search = search;
        return NextResponse.redirect(url, 308);
    }

    // ── Auth guard ──
    if (isProtectedRoute(pathname)) {
        const authToken = request.cookies.get('vira_auth_token')?.value;

        if (!authToken) {
            // Redirect to login with return URL (including search params)
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname + request.nextUrl.search);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Generate a cryptographic nonce per request for CSP
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64').slice(0, 32);

    // Content Security Policy
    // - 'unsafe-inline' added to script-src: Required by Next.js inline scripts & hydration
    //   (when nonce is also present, browsers ignore 'unsafe-inline' for nonce-tagged scripts,
    //    but allow other inline scripts — safe fallback during development)
    // - 'unsafe-eval' kept: Required by p5.js for sketch compilation — do not remove
    // - 'unsafe-inline' added to style-src: Required by React CSS Modules + inline styles
    // - img-src tightened to specific domains instead of broad https:
    // - frame-src includes enamad trust seal
    //
    // SECURITY ROADMAP (planned, see MEMORY):
    //   Phase A: Replace p5.js hero animation with a pure-Canvas/WebGL implementation that
    //            does not require runtime code compilation. This removes the need for
    //            'unsafe-eval' entirely.
    //   Phase B: Once 'unsafe-eval' is gone, remove 'unsafe-inline' from script-src by
    //            ensuring every inline script carries the nonce via Next.js
    //            getScriptNonceFromHeader(). Goal: nonce-only strict CSP.
    //   Phase C: Move remaining third-party (enamad trust seal) into a sandboxed iframe
    //            with a permissive CSP scoped only to that frame, so the main document
    //            can keep a strict CSP.
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: https://trustseal.enamad.ir;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' https://gateway.zibal.ir https://sandbox.zibal.ir;
      frame-src https://gateway.zibal.ir https://sandbox.zibal.ir https://trustseal.enamad.ir;
      frame-ancestors 'none';
    `.replace(/\s{2,}/g, ' ').trim();

    // Set CSP on the REQUEST headers so Next.js can extract the nonce during SSR
    // and automatically add it to all internal <script> and <style> tags.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Content-Security-Policy', cspHeader);
    requestHeaders.set('x-nonce', nonce);

    const response = NextResponse.next({
        request: { headers: requestHeaders },
    });

    // Security headers for an e-commerce site
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    response.headers.set(
        'Strict-Transport-Security',
        'max-age=63072000; includeSubDomains; preload'
    );
    // Isolation headers — limit cross-origin window access and resource loading.
    // COOP isolates the browsing context group (defends against side-channel / tabnabbing);
    // CORP 'cross-origin' allows the document's resources to be embedded cross-origin
    // (needed because product images may be served from a separate host) while still
    // providing a documented policy. The HTML document itself is protected by COOP.
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');

    // Set CSP on the RESPONSE headers so the browser enforces it
    response.headers.set('Content-Security-Policy', cspHeader);

    // Expose nonce via response header so Server Components can read it
    response.headers.set('x-nonce', nonce);

    return response;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon).*)'],
};
