# Payment Gateway TODO

- [x] Keep gateway credentials in `.env.local` and placeholders in `.env.local.example`.
- [x] Configure the gateway client from environment variables only.
- [x] Create a pending WooCommerce order before sending the customer to the gateway.
- [x] Sign the payment callback state so order id and amount cannot be changed client-side.
- [x] Add active `/api/payment/request` and `/api/payment/verify` routes.
- [x] Verify successful payments and redirect to the result page with the reference id.
- [x] Keep card-to-card order verification working with protected order tokens.
- [x] Run TypeScript/build verification.
