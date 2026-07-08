# Task 2-b: Editable Profile + Order Detail Page

## Agent: Coder
## Task ID: 2-b

## Work Summary

Made the profile page fully editable and created the missing order detail page.

## Files Created

1. **`/src/app/api/customer/update/route.ts`** — New API route for updating customer profile
   - Validates JWT via `requireAuth()` from `@/lib/auth-headers`
   - Extracts user ID from JWT using `extractUserIdFromToken` from `@/lib/jwt-utils`
   - Calls WooCommerce REST API `updateCustomer(userId, input)` from `@/lib/woocommerce-rest`
   - Updates `vira_auth_user` cookie with new user data (including firstName/lastName)
   - Returns updated user data in response
   - Proper error handling with WCCustomerError, email validation, empty input check

2. **`/src/app/account/orders/[id]/page.tsx`** — Server metadata wrapper for order detail
   - Sets page metadata (title, description)
   - Renders `OrderDetailContent` client component

3. **`/src/app/account/orders/[id]/OrderDetailContent.tsx`** — Client component for order details
   - Uses `useParams()` to get order ID from URL
   - Uses `useQuery` with `GET_ORDER_DETAILS_QUERY` GraphQL query
   - Back link to orders list
   - Order header: order number, date (Persian formatted), status badge
   - Order items list: product image (or placeholder), name, quantity, total
   - Order summary: total amount, payment method (from metaData)
   - Shipping address section with full address display
   - Handles: loading state, error state, order-not-found state
   - RTL Persian layout, dark theme consistency
   - Status badges with Persian translations (same as OrdersContent.tsx)

## Files Modified

4. **`/src/app/account/profile/ProfileContent.tsx`** — Complete redesign
   - **Display mode**: Avatar circle (first letter with gradient background), displayName, email, username fields with icons, edit button
   - **Edit mode**: Form fields for نام نمایشی (displayName), نام (firstName), نام خانوادگی (lastName), ایمیل (email) with Save/Cancel buttons
   - Loading spinner while saving
   - Error/success toast notifications via `useToast()`
   - Uses `authFetch()` for authenticated API calls
   - Page reload after successful save to reflect cookie changes in AuthContext
   - Uses lucide-react icons (Pencil, Save, X, ArrowRight, User, Mail, AtSign)

5. **`/src/context/AuthContext.tsx`** — Added firstName/lastName to User interface
   - Added `firstName?: string` and `lastName?: string` to User interface
   - Enables ProfileContent to populate edit form with stored first/last names

## Technical Details

- All TypeScript strict typing — `npx tsc --noEmit` passes with zero errors
- ESLint clean — `bun run lint` passes with no warnings or errors
- RTL Persian labels throughout
- Dark theme consistency (bg-slate-900, sky-400/500 accents)
- Proper `use client` directives on client components
- Auth checks with `useAuth()` and redirect to login if unauthenticated
- `sanitizeHtml` used for all WooCommerce HTML content
