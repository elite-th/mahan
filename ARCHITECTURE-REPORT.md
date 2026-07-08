# 🏗️ گزارش جامع معماری پروژه NewModernVIRA
# ═══════════════════════════════════════════════════════════════
# 📐 فروشگاه ویرا — تحلیل معماری، کیفیت کد، امنیت و عملکرد
# 📅 تاریخ: 1404/03/18 | 🔍 تحلیلگر: Architect Agent (نسخه ۲.۰)
# 📅 آخرین بروزرسانی: بعد از اتمام فاز ۱ تا ۳ نقشه راه
# ═══════════════════════════════════════════════════════════════

---

## 📊 خلاصه اجرایی

| معیار | مقدار | ارزیابی |
|-------|-------|---------|
| **نوع پروژه** | فروشگاه اینترنتی (E-Commerce) | 🟢 واضح |
| **فریمورک** | Next.js 16.1.0-canary.11 + React 19.1 | 🟡 Canary (ناپایدار) |
| **زبان** | TypeScript 5 (strict mode) | 🟢 قوی |
| **استایلینگ** | Tailwind CSS 4 + CSS Modules | 🟢 مدرن |
| **دیتابیس** | بدون دیتابیس محلی (WordPress/WooCommerce) | 🟡 وابسته به سرویس خارجی |
| **درگاه پرداخت** | زرین‌پال (Zarinpal) | 🟢 ایرانی |
| **احراز هویت** | WordPress JWT + httpOnly Cookies + Refresh | 🟢 امن |
| **خطوط کد (src/)** | ~8,828 | 🟢 متوسط |
| **فایل‌های منبع** | 84 فایل (47 TSX + 37 TS + 1 d.ts + 2 CSS) | 🟢 قابل مدیریت |
| **وابستگی‌ها** | 8 تولیدی + 10 توسعه | 🟢 سبک |
| **امتیاز کلی** | **7.8 / 10** | 🟢 خوب — بهبود قابل توجه از ۶.۸ |

### 📈 مقایسه با گزارش قبلی

| معیار | قبلی | فعلی | تغییر |
|-------|------|------|-------|
| امتیاز کلی | 6.8/10 | 7.8/10 | ⬆️ +1.0 |
| `any` types | ۱۷ مورد | **۰** | ⬆️ تخیص کامل |
| `<img>` خام | ۶ مورد | **۰** | ⬆️ تخیص کامل |
| Three.js مرده | ~۴۴.۵MB | **حذف شده** | ⬆️ پاکسازی |
| Rate Limiting | ❌ | ✅ (۹ مسیر) | ⬆️ اضافه شد |
| Auth روی write routes | ۲/۴ | ۴/۴ | ⬆️ کامل |
| ISR | ❌ | ✅ (revalidate=300) | ⬆️ فعال |
| Refresh Token | ❌ | ✅ (روتین /api/auth/refresh) | ⬆️ اضافه شد |
| Health Check | ❌ | ✅ (/api/health) | ⬆️ اضافه شد |
| CSP | unsafe-eval + unsafe-inline | nonce-based (unsafe-eval فقط) | ⬆️ بهبود |
| Env Validation | ❌ | ✅ (instrumentation.ts) | ⬆️ اضافه شد |
| Server Components | ۳/۱۲ صفحات | ۸/۱۲ صفحات | ⬆️ ۵ صفحه تبدیل شد |
| not-found.tsx | ❌ | ✅ | ⬆️ اضافه شد |
| Logger | console.error | Structured JSON Logger | ⬆️ اضافه شد |

---

## 🏆 جدول امتیازدهی

| # | دسته‌بندی | امتیاز قبلی | امتیاز فعلی | تغییر | وضعیت | اولویت بهبود |
|---|-----------|-------------|-------------|-------|-------|---------------|
| 1 | ساختار پروژه | 8.0/10 | 8.5/10 | ⬆️ | 🟢 خوب | پایین |
| 2 | صفحات و مسیریابی | 6.0/10 | 8.0/10 | ⬆️⬆️ | 🟢 خوب | متوسط |
| 3 | کامپوننت‌ها | 6.0/10 | 7.0/10 | ⬆️ | 🟢 خوب | متوسط |
| 4 | هوک‌ها | 5.0/10 | 7.5/10 | ⬆️⬆️ | 🟢 خوب | پایین |
| 5 | مدیریت State | 8.0/10 | 8.0/10 | ➡️ | 🟢 خوب | پایین |
| 6 | استایلینگ و RTL | 8.0/10 | 8.0/10 | ➡️ | 🟢 خوب | پایین |
| 7 | ایمنی تایپ (TypeScript) | 6.0/10 | 9.0/10 | ⬆️⬆️⬆️ | 🟢 عالی | پایین |
| 8 | عملکرد (Performance) | 5.0/10 | 7.5/10 | ⬆️⬆️ | 🟢 خوب | متوسط |
| 9 | دسترسی‌پذیری (a11y) | 7.0/10 | 7.5/10 | ⬆️ | 🟢 خوب | متوسط |
| 10 | کیفیت کد | 5.5/10 | 7.5/10 | ⬆️⬆️ | 🟢 خوب | متوسط |
| 11 | مسیرهای API | 7.0/10 | 8.5/10 | ⬆️⬆️ | 🟢 خوب | پایین |
| 12 | امنیت | 6.0/10 | 7.0/10 | ⬆️ | 🟡 متوسط | بالا |
| 13 | یکپارچه‌سازی خارجی | 7.5/10 | 8.0/10 | ⬆️ | 🟢 خوب | پایین |
| 14 | مدیریت خطا | 6.5/10 | 7.5/10 | ⬆️ | 🟢 خوب | متوسط |
| 15 | زیرساخت و DevOps | 5.0/10 | 7.0/10 | ⬆️⬆️ | 🟢 خوب | متوسط |

**امتیاز میانگین وزنی: 7.8 / 10** (⬆️ +1.0 از نسخه قبلی)

---

## 📁 ۱. ساختار پروژه

### نقشه دایرکتوری

```
NewModernVIRA/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── api/                    # مسیرهای API بک‌اند
│   │   │   ├── auth/               # احراز هویت (login, logout, session, refresh)
│   │   │   ├── graphql/            # پروکسی GraphQL
│   │   │   ├── health/             # ✅ Health Check Endpoint
│   │   │   ├── order/              # سفارشات (create, verify)
│   │   │   ├── payment/            # پرداخت (request, verify)
│   │   │   └── register/           # ثبت‌نام کاربر
│   │   ├── account/                # صفحه حساب کاربری
│   │   │   ├── orders/             # سفارشات کاربر
│   │   │   ├── profile/            # پروفایل کاربر
│   │   │   ├── layout.tsx          # Auth Guard Layout
│   │   │   └── AccountContent.tsx  # محتوای حساب
│   │   ├── cart/                   # سبد خرید
│   │   ├── checkout/               # تسویه حساب
│   │   ├── login/                  # ورود (Server Shell + Client Form)
│   │   ├── order/                  # سفارش سریع
│   │   ├── payment/result/         # نتیجه پرداخت
│   │   ├── product/[slug]/         # صفحه محصول (داینامیک + ISR)
│   │   ├── products/               # لیست محصولات (ISR)
│   │   ├── register/               # ثبت‌نام (Server Shell + Client Form)
│   │   ├── error.tsx               # ✅ Error Boundary جهانی
│   │   ├── not-found.tsx           # ✅ صفحه 404 سفارشی
│   │   ├── layout.tsx              # لایه‌اوت اصلی (CSP nonce)
│   │   ├── page.tsx                # صفحه اصلی
│   │   ├── Providers.tsx           # Providerها
│   │   └── globals.css             # استایل‌های جهانی
│   ├── components/                 # کامپوننت‌های React
│   │   ├── layout/                 # Header, NavLinks, UserMenu
│   │   ├── ui/                     # FilterSidebar, Icons
│   │   ├── AboutSection.tsx        # انیمیشن p5.js (درباره ما)
│   │   ├── HeroSection.tsx         # انیمیشن p5.js (هیرو)
│   │   ├── HeroSketchEngine.tsx    # موتور انیمیشن هیرو
│   │   ├── ContactSection.tsx      # فرم تماس
│   │   ├── FaqSection.tsx          # سوالات متداول
│   │   ├── FeaturedProductsClient.tsx  # محصولات ویژه
│   │   ├── Footer.tsx              # فوتر (Server Component)
│   │   ├── LoadingSpinner.tsx      # اسپینر لودینگ
│   │   ├── OurClientsSection.tsx   # مشتریان ما (Server Component)
│   │   ├── ProductCard.tsx         # کارت محصول
│   │   ├── ProductListSection.tsx  # لیست محصولات (Server Component)
│   │   ├── ErrorDisplay.tsx        # نمایش خطا
│   │   ├── Toast.tsx               # نوتیفیکیشن
│   │   ├── ClientLogoCard.tsx      # کارت لوگو
│   │   └── HeroSection.module.css  # استایل هیرو
│   ├── context/                    # React Context
│   │   ├── AuthContext.tsx         # احراز هویت + auto-refresh
│   │   ├── CartContext.tsx         # سبد خرید + integrity
│   │   └── ToastContext.tsx        # نوتیفیکیشن
│   ├── hooks/                      # هوک‌های سفارشی
│   │   ├── useHeroSketch.ts       # ✅ انیمیشن هیرو (p5.js) — مستخرج
│   │   ├── useIntersectionObserver.ts # ✅ Observer عمومی — مستخرج
│   │   └── useDebounce.ts          # ✅ دیبونس عمومی — مستخرج
│   ├── lib/                        # لاجیک سرور و ابزارها
│   │   ├── apollo-wrapper.tsx      # Apollo Client (کلاینت + SSR)
│   │   ├── apollo-client-server.ts # Apollo Client (سرور RSC)
│   │   ├── api-response.ts         # ⚠️ فایل مرده (۰ ایمپورت)
│   │   ├── auth-headers.ts         # ✅ requireAuth() + auto-refresh
│   │   ├── cart-integrity.ts       # هش یکپارچگی سبد
│   │   ├── env-validation.ts       # ✅ اعتبارسنجی env vars
│   │   ├── fetch-with-timeout.ts   # ✅ fetch با timeout
│   │   ├── idempotency-cache.ts    # کش ایدم‌پوتنسی
│   │   ├── logger.ts               # ✅ لاگر ساختاریافته JSON
│   │   ├── order-utils.ts          # ابزارهای سفارش
│   │   ├── payment-state.ts        # وضعیت پرداخت (HMAC)
│   │   ├── rate-limiter.ts         # ✅ Rate Limiter اسلایدینگ ویندو
│   │   ├── woocommerce-rest.ts     # کلاینت WooCommerce REST
│   │   └── zarinpal.ts             # SDK درگاه زرین‌پال
│   ├── graphql/                    # GraphQL
│   │   └── queries.ts              # کوئری‌ها
│   ├── utils/                      # ابزارهای عمومی
│   │   ├── formatting.ts           # فرمت‌دهی اعداد و قیمت
│   │   ├── sanitize.ts             # پاک‌سازی HTML (DOMPurify)
│   │   └── performance.ts          # تشخیص دستگاه ضعیف
│   ├── types/                      # تایپ‌های متمرکز
│   │   ├── woocommerce.ts          # ✅ تایپ‌های WooCommerce REST
│   │   └── browser.d.ts            # ✅ Navigator augmentation
│   ├── types.ts                    # تایپ‌های عمومی
│   ├── constants.ts                # ثابت‌های برنامه
│   ├── instrumentation.ts          # ✅ اعتبارسنجی env در startup
│   └── middleware.ts               # ✅ CSP + security headers
├── RULE/                           # ✅ قوانین پروژه (R0-R11)
├── ci-workflow-templates/          # ✅ CI/CD الگو
├── Dockerfile                      # ✅ 3-stage Docker build
├── public/                         # فایل‌های استاتیک
├── worklog.md                      # ✅ لاگ کارها
└── ARCHITECTURE-REPORT.md          # این فایل
```

### ارزیابی: 🟢 8.5/10 — ساختار منظم و بهبود یافته

**نقاط قوت:**
- تفکیک واضح صفحات، کامپوننت‌ها، هوک‌ها، کانتکست‌ها و لاجیک سرور
- مسیرهای API به‌صورت ماژولار سازماندهی شده‌اند
- تایپ‌ها متمرکز در `types/` و `types.ts`
- هوک‌ها مستخرج شده (`useDebounce`, `useIntersectionObserver`, `useHeroSketch`)
- قانون‌ها و ورکلاگ داکیومنت شده

**نقاط ضعف:**
- 🟡 `src/lib/api-response.ts` مرده (۰ ایمپورت) — باید حذف شود یا ادغام شود
- 🟡 فایل‌های باقی‌مانده از دوره Vite در ریشه (`vite.config.ts`, `index.html`, `index.tsx`)
- 🟡 فایل‌های دیباگ خالی (`graphql_response.json`, `product_643_debug.json`, `test-graphql.js`)

---

## 📄 ۲. صفحات و مسیریابی

### جدول صفحات

| مسیر | فایل | Server/Client | داینامیک | SEO | ISR |
|------|------|---------------|----------|-----|-----|
| `/` | `page.tsx` | 🟢 Server | خیر | ✅ | ❌ |
| `/products` | `products/page.tsx` | 🟢 Server | خیر | ✅ | ✅ revalidate=300 |
| `/product/[slug]` | `product/[slug]/page.tsx` | 🟢 Server | بله | ✅ generateMetadata | ✅ revalidate=300 |
| `/cart` | `cart/page.tsx` | 🔴 Client | خیر | ❌ بدون metadata | ❌ |
| `/checkout` | `checkout/page.tsx` | 🔴 Client | خیر | ❌ بدون metadata | ❌ |
| `/login` | `login/page.tsx` | 🟢 Server | خیر | ✅ | ❌ |
| `/register` | `register/page.tsx` | 🟢 Server | خیر | ✅ | ❌ |
| `/order` | `order/page.tsx` | 🔴 Client | خیر | ❌ بدون metadata | ❌ |
| `/payment/result` | `payment/result/page.tsx` | 🔴 Client | خیر | ❌ بدون metadata | ❌ |
| `/account` | `account/page.tsx` | 🟢 Server | خیر | ✅ | ❌ |
| `/account/orders` | `account/orders/page.tsx` | 🟢 Server | خیر | ✅ | ❌ |
| `/account/profile` | `account/profile/page.tsx` | 🟢 Server | خیر | ✅ | ❌ |
| `404` | `not-found.tsx` | 🟢 Server | خیر | ✅ | ❌ |

### ارزیابی: 🟢 8.0/10 — بهبود قابل توجه

**نقاط قوت:**
- ✅ ۸ صفحه از ۱۲ به‌صورت Server Component (۶۶% — قبلاً ۲۵%)
- ✅ `generateMetadata` در صفحه محصول
- ✅ صفحه 404 سفارشی اضافه شده
- ✅ ISR با `revalidate = 300` برای صفحات محصول
- ✅ الگوی "Server Shell + Client Interactive Island" در login, register, account pages

**نقاط ضعف:**
- 🟡 ۴ صفحه هنوز Client Component هستند (cart, checkout, order, payment/result)
- 🟡 صفحات cart و checkout بدون metadata — سئو ضعیف
- 🟡 تکرار عملکرد بین `/checkout` و `/order` — هر دو فرم سفارش دارند
- 🟡 `shippingCost` در checkout همیشه ۰ است — کد مرده

---

## 🧩 ۳. کامپوننت‌ها

### فهرست ۱۷ کامپوننت فعال

| کامپوننت | دسته | الگو | استفاده | وضعیت |
|-----------|------|------|---------|--------|
| Header | Layout | FC | layout.tsx | ✅ |
| NavLinks | Layout | FC + memo | Header | ✅ |
| UserMenu | Layout | FC | Header | ✅ |
| Footer | Layout | FC (Server) | layout.tsx | ✅ |
| HeroSection | Feature | FC | page.tsx | ✅ |
| HeroSketchEngine | Feature | FC | HeroSection | ✅ |
| AboutSection | Feature | FC | page.tsx | ✅ |
| FeaturedProductsClient | Feature | FC | page.tsx | ✅ |
| ProductListSection | Feature | FC (Server) | FeaturedProductsClient | ✅ |
| ProductCard | UI | FC | ProductGrid, ProductListSection | ✅ |
| ClientLogoCard | UI | FC + memo | OurClientsSection | ✅ |
| OurClientsSection | Feature | FC (Server) | page.tsx | ✅ |
| FaqSection | Feature | FC | page.tsx | ✅ |
| ContactSection | Feature | FC | page.tsx, product page | ✅ |
| FilterSidebar | UI | FC (Server) ⚠️ | ProductGrid | ✅ |
| ErrorDisplay | Shared | FC | چندین صفحه | ✅ |
| LoadingSpinner | Shared | FC (Server) | چندین صفحه | ✅ |
| Toast | Shared | FC | Providers | ✅ |
| Icons (shared) | UI | FC | Header, UserMenu | ✅ |

### ارزیابی: 🟢 7.0/10 — بهبود یافته

**نقاط قوت:**
- ✅ کامپوننت‌های مرده حذف شدند (HeroCanvas, ParticlesInstanced, SiteLogo, ErrorBoundary)
- ✅ ترکیب بهتر Server و Client Components
- ✅ `React.memo` برای NavLinks و ClientLogoCard
- ✅ آیکون‌ها در ماژول مرکزی `icons/Icons.tsx`

**نقاط ضعف:**
- 🟡 آیکون‌های SVG هنوز در چندین فایل تکرار شده‌اند (ProductDetailsClient, AccountContent, checkout)
- 🟡 `FilterSidebar` به احتمال زیاد نیاز به `"use client"` دارد (کنترل‌های تعاملی)
- 🟡 `QuantityControl` در cart/page.tsx inline تعریف شده — باید استخراج شود
- 🟡 `FormField` در order/page.tsx inline تعریف شده — باید استخراج شود

---

## 🪝 ۴. هوک‌های سفارشی

| هوک | فایل | هدف | کیفیت |
|------|------|------|-------|
| useHeroSketch | `hooks/useHeroSketch.ts` | انیمیشن p5.js هیرو | 🟢 عالی |
| useDebounce | `hooks/useDebounce.ts` | دیبونس عمومی | 🟢 خوب |
| useIntersectionObserver | `hooks/useIntersectionObserver.ts` | Observer عمومی | 🟢 خوب |

### ارزیابی: 🟢 7.5/10 — بهبود قابل توجه

**نقاط قوت:**
- ✅ `useDebounce` از inline استخراج و generic شد
- ✅ `useIntersectionObserver` مستخرج شد
- ✅ `useHeroSketch` با کیفیت بالا: SSR-safe، race condition guards، Strict Mode support، throttled resize، Observer Stability pattern

**نقاط ضعف:**
- 🟡 فرصت‌های بیشتر برای استخراج: `useScrollPosition` (Header.tsx)
- 🟡 `useIntersectionObserver` ref در dependency array — foot-gun

---

## 🔄 ۵. مدیریت State

### فهرست Contextها

| Context | فایل | State | مصرف‌کنندگان | کیفیت |
|---------|------|-------|-------------|-------|
| ToastContext | `context/ToastContext.tsx` | toasts[], showToast, removeToast | ۷ فایل | 🟡 |
| AuthContext | `context/AuthContext.tsx` | user, isLoggedIn, isLoading, login, logout, authFetch | ۸ فایل | 🟢 |
| CartContext | `context/CartContext.tsx` | cartItems[], isHydrated, عملیات سبد | ۸ فایل | 🟢 |

### ارزیابی: 🟢 8.0/10

**نقاط قوت:**
- همه Contextها از `useMemo` و `useCallback` استفاده می‌کنند
- Cart از `isHydrated` برای جلوگیری از hydration mismatch
- Auth از httpOnly cookies + auto-refresh
- `authFetch` با تلاش مجدد خودکار روی 401
- Cart از `cart-integrity.ts` برای تشخیص دستکاری قیمت

**نقاط ضعف:**
- 🟡 `showToast` همه toastها را جایگزین می‌کند — فقط ۱ toast همزمان قابل نمایش
- 🟡 `isLoading` در AuthContext دو حالت را ترکیب می‌کند
- 🟡 `CartContext` قیمت‌های مشکوک (price < 100) را حذف می‌کند — آستانه دلخواه

---

## 🎨 ۶. استایلینگ و RTL

### رویکرد: Tailwind CSS 4 + CSS Modules (هیبرید)

| روش | فایل‌ها | استفاده |
|------|---------|---------|
| Tailwind CSS | ~۳۵ فایل | رویکرد اصلی |
| CSS Modules | `HeroSection.module.css` | انیمیشن‌های پیچیده هیرو |
| Global CSS | `globals.css` | استایل‌های پایه، انیمیشن‌ها، اسکرولبار |

### ارزیابی: 🟢 8.0/10

**نقاط قوت:**
- Tailwind v4 با `@import "tailwindcss"` و `@theme`
- فونت Vazirmatn با `next/font/google` و `display: 'swap'`
- RTL با `<html lang="fa" dir="rtl">` و `rtl:` prefix ها
- طراحی Responsive با breakpoints منظم
- `@tailwindcss/typography` برای محتوای محصول

**نقاط ضعف:**
- 🟡 فقط HeroSection از CSS Modules استفاده می‌کند — ناسازگاری با بقیه پروژه
- 🟡 ۷ `@keyframes` در globals.css — باید متمرکزتر شوند
- 🟡 انیمیشن‌های CSS وابسته به کلاس `body.is-active` هستند

---

## 🔒 ۷. ایمنی تایپ (TypeScript)

### آمار

| معیار | مقدار قبلی | مقدار فعلی | ارزیابی |
|-------|------------|------------|---------|
| strict mode | ✅ فعال | ✅ فعال | 🟢 |
| `: any` استفاده شده | ۱۷ مورد | **۰** | 🟢 عالی |
| Type assertion (`as`) | ~۵ مورد | ~۳ مورد (ضروری) | 🟢 |
| Interface/Type متمرکز | `types.ts` | `types.ts` + `types/` | 🟢 |
| Navigator augmentation | ❌ | ✅ `browser.d.ts` | 🟢 |
| WooCommerce types | ❌ | ✅ `woocommerce.ts` | 🟢 |

### ارزیابی: 🟢 9.0/10 — بهبود چشمگیر

**نقاط قوت:**
- ✅ **صفر `any` در کل codebase**
- ✅ Discriminated union برای `WCRestResponse<T>`
- ✅ Type guard برای CartContext
- ✅ Generic `useDebounce<T>`
- ✅ `Promise<{slug: string}>` برای Next.js 16 params
- ✅ `unknown + instanceof` برای error handling
- ✅ Navigator augmentation برای hardwareConcurrency/deviceMemory

**نقاط ضعف:**
- 🟡 `Product.price` نوع `number` ولی `ProductNode.price` نوع `string` — ناسازگاری
- 🟡 `WCOrder.total` نوع `string` — باید با `parseGatewayAmount` تبدیل شود
- 🟡 `graphql/route.ts` پاسخ بدون تایپ (any ضمنی)
- 🟡 `rate-limiter.ts` یک `as unknown as NextResponse` دارد

---

## ⚡ ۸. عملکرد (Performance)

### ارزیابی: 🟢 7.5/10 — بهبود قابل توجه

**نقاط قوت:**
- ✅ Three.js مرده حذف شد (~۴۴.۵MB)
- ✅ `next/image` در همه تصاویر (بجای `<img>` خام)
- ✅ `images.unoptimized: true` حذف شد
- ✅ ISR با `revalidate = 300` در صفحات محصول
- ✅ `fetchWithTimeout` با AbortController در همه API calls
- ✅ Dynamic import برای HeroSketchEngine با `ssr: false`
- ✅ `import type p5` + `await import('p5')` برای SSR safety
- ✅ `next/font/google` با `display: 'swap'`
- ✅ تشخیص دستگاه ضعیف و تنظیم پارتیکل‌ها
- ✅ IntersectionObserver برای توقف انیمیشن вне viewport

**نقاط ضعف:**

| مشکل | شدت | توضیح |
|------|------|-------|
| 🟡 fetch ۱۰۰۰ محصول | هشدار | `first: 1000` در GraphQL query — باید صفحه‌بندی شود |
| 🟡 `parseWooCommercePrice` مکرر | هشدار | در sort/filter بدون cache — باید pre-compute شود |
| 🟡 `fetchPolicy: 'no-cache'` | هشدار | محصولات ویژه هر بار از GraphQL fetch می‌شوند |
| 🟡 InMemoryCache در RSC | هشدار | `apollo-client-server.ts` هر بار cache جدید می‌سازد |
| 🟡 `p5.Color` هر فریم | پایین | در `useHeroSketch` — GC pressure |

---

## ♿ ۹. دسترسی‌پذیری (Accessibility)

### ارزیابی: 🟢 7.5/10

**نقاط قوت:**
- ✅ ARIA attributes گسترده: `aria-expanded`, `aria-controls`, `aria-checked`, `aria-invalid`
- ✅ `role="status"` و `aria-live="polite"` برای LoadingSpinner
- ✅ `role="alert"` برای ErrorDisplay
- ✅ `focus-visible` styles در globals.css
- ✅ RTL پشتیبانی کامل با `dir="rtl"` و `rtl:` prefix ها
- ✅ `alt` text برای همه تصاویر (next/image)
- ✅ صفحه 404 با CTA واضح

**نقاط ضعف:**
- 🟡 UserMenu dropdown بدون `Escape` key handler
- 🟡 FAQ accordion بدون keyboard navigation بین آیتم‌ها
- 🟡 بدون skip-to-content link
- 🟡 `window.confirm` در cart page — غیر قابل شخصی‌سازی

---

## 🛡️ ۱۰. امنیت

### ارزیابی: 🟡 7.0/10 — بهبود یافته ولی نیاز به تقویت

### هدرهای امنیتی (middleware.ts)

| هدر | مقدار | ارزیابی |
|-----|-------|---------|
| X-Frame-Options | DENY | 🟢 |
| X-Content-Type-Options | nosniff | 🟢 |
| Referrer-Policy | strict-origin-when-cross-origin | 🟢 |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | 🟢 |
| Strict-Transport-Security | max-age=63072000; includeSubDomains; preload | 🟢 |
| Content-Security-Policy | nonce-based, `unsafe-eval` (برای p5.js) | 🟡 بهبود یافته |

### یافته‌های امنیتی فعلی

| یافته | شدت | توضیح | وضعیت |
|-------|------|-------|--------|
| 🔴 GraphQL proxy بدون query allowlisting | بحرانی | کاربران احراز شده می‌توانند mutation مخرب اجرا کنند | ❌ باز |
| 🔴 `vira_auth_user` cookie بدون امضا | بالا | قابل تغییر توسط کاربر —spoofing هویت | ❌ باز |
| 🟡 `unsafe-eval` در CSP (p5.js) | هشدار | ضعف حفاظت XSS | 🟡 ناپذیرفتنی |
| 🟡 IP spoofing در rate limiter | هشدار | `X-Forwarded-For` قابل جعل | ❌ باز |
| 🟡 `style` attribute در DOMPurify allowlist | هشدار | CSS injection ممکن | ❌ باز |
| 🟡 Open redirect در checkout | هشدار | `window.location.href = data.url` بدون validation | ❌ باز |
| 🟡 `/api/health` اطلاعات حساس فاش می‌کند | هشدار | env vars، URLهای داخلی | ❌ باز |
| 🟡 `/api/auth/refresh` بدون rate limiting | هشدار | قابل سوءاستفاده | ❌ باز |
| 🟡 `NEXT_PUBLIC_WP_API_URL` به جای env سمت سرور | پایین | URL سرور در bundle کلاینت | ❌ باز |
| 🟡 No CSRF protection روی POST routes | پایین | SameSite=Lax فقط محافظت جزئی | ❌ باز |
| 🟡 `NEXT_PUBLIC_CARD_NUMBER` در JS bundle | پایین | شماره کارت بانکی در کلاینت | 🟡 ناپذیرفتنی |

### نقاط قوت امنیتی:
- ✅ JWT در httpOnly cookie (نه localStorage)
- ✅ `sameSite: 'lax'` و `secure: true` در تولید
- ✅ HMAC-SHA256 برای payment state با timing-safe comparison
- ✅ `crypto.timingSafeEqual` برای token verification
- ✅ Rate limiting روی ۹ مسیر API
- ✅ احراز هویت روی payment/order routes
- ✅ اعتبارسنجی env vars در startup
- ✅ DOMPurify برای sanitization HTML
- ✅ Refresh token rotation
- ✅ Nonce-based CSP (بدون unsafe-inline)
- ✅ Generic error messages (بدون نشت اطلاعات)
- ✅ Idempotency برای جلوگیری از ارسال تکراری

---

## 🔌 ۱۱. مسیرهای API

### فهرست ۱۰ مسیر

| # | مسیر | متد | خطوط | هدف | Rate Limit | احراز هویت |
|---|------|------|------|------|------------|------------|
| 1 | `/api/auth/login` | POST | 116 | ورود JWT | ✅ 10/min | عمومی |
| 2 | `/api/auth/logout` | POST | 37 | خروج | ✅ 60/min | عمومی |
| 3 | `/api/auth/session` | GET | 175 | بررسی سشن + refresh | ✅ 60/min | عمومی |
| 4 | `/api/auth/refresh` | POST | 103 | ✅ Refresh Token | ❌ بدون | عمومی |
| 5 | `/api/graphql` | POST | 69 | پروکسی GraphQL | ✅ 60/min | اختیاری |
| 6 | `/api/payment/request` | POST | 181 | ایجاد پرداخت | ✅ 60/min | ✅ requireAuth |
| 7 | `/api/payment/verify` | GET | 102 | تأیید پرداخت | ✅ 60/min | ✅ HMAC |
| 8 | `/api/order/create` | POST | 109 | ایجاد سفارش | ✅ 60/min | ✅ requireAuth |
| 9 | `/api/order/verify` | POST | 77 | تأیید سفارش | ✅ 60/min | ✅ token |
| 10 | `/api/register` | POST | 93 | ثبت‌نام | ✅ 10/min | عمومی |
| 11 | `/api/health` | GET | 97 | ✅ Health Check | ❌ بدون | عمومی |

### ارزیابی: 🟢 8.5/10 — بهبود چشمگیر

**نقاط قوت:**
- ✅ Rate limiting روی ۹ از ۱۱ مسیر
- ✅ `requireAuth()` با auto-refresh روی payment و order routes
- ✅ الگوی ایدمپوتنسی برای جلوگیری از ارسال تکراری
- ✅ HMAC-SHA256 برای payment state
- ✅ timing-safe comparison برای token verification
- ✅ `fetchWithTimeout` در همه fetch calls
- ✅ Structured logging با `logger.ts`
- ✅ Non-JSON response handling
- ✅ Health check endpoint
- ✅ Refresh token endpoint

**نقاط ضعف:**
- 🔴 `/api/graphql` بدون query/mutation allowlisting
- 🟡 `/api/auth/refresh` بدون rate limiting
- 🟡 `/api/health` اطلاعات حساس فاش می‌کند بدون auth
- 🟡 `validateCheckoutPayload` سطحی — بدون validation ایمیل، کد پستی
- 🟡 `createIdempotencyKey` از MD5 استفاده می‌کند
- 🟡 `request.json()` بدون schema validation (zod)
- 🟡 `getClientCartTotal` — `Number(item.price) || 0` NaN را ۰ می‌کند

---

## 🔗 ۱۲. یکپارچه‌سازی خارجی

### WordPress/WooCommerce

| اینترفیس | نوع | استفاده | کیفیت |
|-----------|------|---------|-------|
| WooCommerce REST API | REST | ایجاد/بروزرسانی سفارشات | 🟢 |
| WPGraphQL | GraphQL | خواندن محصولات و سفارشات | 🟢 |
| WordPress JWT Auth | REST | احراز هویت + refresh | 🟢 |
| WordPress REST Register | REST | ثبت‌نام کاربر | 🟢 |

### زرین‌پال (Zarinpal)

| ویژگی | وضعیت |
|--------|--------|
| Sandbox support | ✅ |
| Currency config | ✅ (IRT) |
| Timeout | ✅ fetchWithTimeout |
| Retry logic | ❌ بدون retry |
| Response validation | ❌ بدون validation |

### ارزیابی: 🟢 8.0/10

**نقاط ضعف:**
- 🟡 بدون retry logic برای خطاهای گذرا
- 🟡 بدون response validation برای Zarinpal API
- 🟡 GraphQL mutations مرده حذف نشده

---

## ❌ ۱۳. مدیریت خطا

### ارزیابی: 🟢 7.5/10 — بهبود یافته

**نقاط قوت:**
- ✅ `error.tsx` جهانی با دکمه retry
- ✅ `not-found.tsx` سفارشی
- ✅ `ErrorDisplay` قابل استفاده مجدد
- ✅ Generic error messages (بدون نشت stack trace)
- ✅ HTTP status codes صحیح
- ✅ Structured logging با `logger.ts` (JSON در تولید)
- ✅ `fetchWithTimeout` با AbortError handling (504)
- ✅ Graceful handling برای non-JSON WooCommerce responses

**نقاط ضعف:**
- 🟡 بدون error monitoring service (Sentry/DataDog)
- 🟡 بدون error codes برای پردازش frontend
- 🟡 فرمت پاسخ خطا ناسازگار (بعضی `error`، بعضی `message`)
- 🟡 `console.error` در error.tsx و checkout/page.tsx — ممکن است اطلاعات حساس لو برود

---

## 🔧 ۱۴. زیرساخت و DevOps

### ارزیابی: 🟢 7.0/10 — بهبود قابل توجه

| جنبه | وضعیت قبلی | وضعیت فعلی | توضیح |
|-------|------------|------------|-------|
| Docker config | 🟡 | ✅ | 3-stage Dockerfile با standalone output |
| Environment validation | 🔴 | ✅ | `instrumentation.ts` + `env-validation.ts` |
| Logging | 🟡 | ✅ | Structured JSON logger |
| Monitoring | 🔴 | 🟡 | Health check endpoint — بدون Sentry |
| CI/CD | ❓ | 🟡 | `ci-workflow-templates/` وجود دارد ولی غیرفعال |
| Rate limiting | 🔴 | ✅ | Sliding window روی ۹ مسیر |
| Caching strategy | 🟡 | ✅ | ISR با revalidate=300 |
| Health check | 🔴 | ✅ | `/api/health` با WordPress connectivity check |
| Security headers | 🟡 | ✅ | Middleware با CSP + HSTS + X-Frame-Options |

**نقاط ضعف:**
- 🟡 `autoprefixer` در production deps — باید devDependency باشد
- 🟡 `eslint-config-next@15.5.0` vs `next@16.1.0-canary` — نسخه ناسازگار
- 🟡 بدون test framework
- 🟡 Canary Next.js در تولید — ریسک ناپایداری

---

## 🗺️ دیاگرام معماری

```
┌──────────────────────────────────────────────────────────────────┐
│                        مرورگر (Client)                           │
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌──────────────┐  ┌─────────┐ │
│  │ AuthContext │  │ CartContext│  │ ApolloClient │  │ صفحات   │ │
│  │ (httpOnly   │  │(localStorage│ │(/api/graphql)│  │ تعاملی  │ │
│  │  cookies +  │  │  + hash)   │  │              │  │         │ │
│  │ auto-refresh│  │            │  │              │  │         │ │
│  └──────┬──────┘  └─────┬──────┘  └──────┬───────┘  └────┬────┘ │
└─────────┼──────────────┼────────────────┼───────────────┼──────┘
          │              │                │               │
     ┌────▼────┐   ┌────▼─────┐   ┌─────▼────┐   ┌─────▼──────┐
     │/api/auth│   │  (local) │   │/api/     │   │/api/payment│
     │  /*     │   │          │   │ graphql  │   │/* & /api/  │
     │+refresh │   │          │   │          │   │order/*     │
     └────┬────┘   └──────────┘   └────┬─────┘   └─────┬──────┘
          │                             │               │
     ┌────▼─────────────────────────────▼───────────────▼───────┐
     │              مسیرهای API Next.js (Server)                │
     │        Rate Limiting + Auth + Timeout + Logging          │
     │                                                          │
     │  ┌──────────────┐  ┌─────────────┐  ┌────────────────┐  │
     │  │ Auth Routes  │  │GraphQL Proxy│  │Payment/Order   │  │
     │  │login/logout  │  │             │  │Routes          │  │
     │  │/session      │  │             │  │                │  │
     │  │/refresh      │  │             │  │                │  │
     │  └──────┬───────┘  └──────┬──────┘  └───┬────────────┘  │
     │         │                 │              │               │
     │  ┌──────▼─────────────────▼──────────────▼────────────┐  │
     │  │            کتابخانه‌های سرور                        │  │
     │  │  rate-limiter │ auth-headers │ logger              │  │
     │  │  fetch-timeout │ env-validation                    │  │
     │  │  woocommerce-rest │ zarinpal │ payment-state       │  │
     │  │  order-utils      │ idempotency-cache              │  │
     │  └──────────┬─────────────────┬──────────────────────┘  │
     └─────────────┼─────────────────┼─────────────────────────┘
                   │                 │
          ┌────────▼──┐       ┌─────▼───────┐
          │ WordPress  │       │ زرین‌پال     │
          │ WooCommerce│       │ درگاه پرداخت│
          │ REST+GraphQL│       │             │
          └────────────┘       └─────────────┘
```

---

## 🚨 یافته‌های بحرانی و اولویت‌دار فعلی

### 🔴 بحرانی (باید فیکس شود)

| # | مشکل | تأثیر | راه‌حل |
|---|------|-------|--------|
| 1 | GraphQL proxy بدون query/mutation allowlisting | کاربران احراز شده می‌توانند mutation مخرب اجرا کنند | اضافه کردن query allowlist یا محدود کردن به read-only |
| 2 | `vira_auth_user` cookie بدون امضای HMAC |spoofing هویت کاربر | امضای محتوای cookie با HMAC یا ذخیره در سمت سرور |

### 🟡 هشدار (باید بهبود یابد)

| # | مشکل | تأثیر | راه‌حل |
|---|------|-------|--------|
| 3 | حذف فایل‌های مرده و باقی‌مانده | کاهش پیچیدگی | حذف `api-response.ts`, `vite.config.ts`, `index.html`, فایل‌های دیباگ |
| 4 | `/api/auth/refresh` بدون rate limiting | قابل سوءاستفاده | اضافه کردن rate limit |
| 5 | `style` attribute در DOMPurify allowlist | CSS injection | حذف `style` از ALLOWED_ATTR |
| 6 | Open redirect در checkout | تغییر مسیر مخرب | validation دامنه URL |
| 7 | `/api/health` بدون auth | نشت اطلاعات | محدود کردن به IPهای داخلی |
| 8 | IP spoofing در rate limiter | بای‌پس rate limiting | تنظیم trusted proxy count |
| 9 | تکرار `/checkout` و `/order` | نگهداری سخت | ادغام یا حذف یکی |
| 10 | `autoprefixer` در production deps | bundle اضافی | انتقال به devDependencies |
| 11 | `eslint-config-next@15.5.0` ناسازگار | lint نادرست | بروزرسانی به نسخه 16+ |
| 12 | `validateCheckoutPayload` سطحی | داده نامعتبر | اضافه کردن validation ایمیل/کدپستی |
| 13 | `fetchWithTimeout` signal overwrite | از دست رفتن signal اصلی | استفاده از `AbortSignal.any()` |
| 14 | `order/verify` بدون duplicate check | تأیید تکراری | بررسی وضعیت سفارش قبل از verify |
| 15 | Console logging اطلاعات حساس | نشت اطلاعات | حذف `console.error` با داده ریکوئست |

---

## 📈 نقشه راه پیشنهادی (بروزرسانی شده)

### ✅ فاز ۱: بهبود بحرانی — تکمیل شده (commit a1800d8)
1. ✅ حذف وابستگی‌های Three.js مرده
2. ✅ افزودن Rate Limiting (۹ مسیر)
3. ✅ احراز هویت در payment/order API routes
4. ✅ جایگزینی `any` با تایپ‌های دقیق
5. ✅ اعتبارسنجی env vars در startup

### ✅ فاز ۲: بهبود کیفیت — تکمیل شده
6. ✅ تثبیت آیکون‌ها (ماژول مرکزی icons/)
7. ✅ حذف کد مرده (HeroCanvas, ParticlesInstanced, SiteLogo, ErrorBoundary)
8. ✅ استخراج هوک‌های مشترک (useDebounce, useIntersectionObserver)
9. ✅ یکسان‌سازی فرمت پاسخ API (api-response.ts — ولی استفاده نشده)
10. ✅ افزودن `not-found.tsx`

### ✅ فاز ۳: بهبود عملکرد — تکمیل شده (commit 81e9c2a)
11. ✅ فعال‌سازی ISR (revalidate = 300)
12. ✅ جایگزینی `<img>` با `next/image`
13. ✅ تبدیل ۵ صفحه به Server Components (login, register, account, orders, profile)
14. ✅ افزودن timeout به fetch calls
15. ✅ بهبود CSP (nonce-based, حذف unsafe-inline)

### 🔲 فاز ۴: بهبود امنیت و زیرساخت
16. GraphQL proxy query allowlisting / read-only mode
17. امضای HMAC برای `vira_auth_user` cookie
18. افزودن rate limiting به `/api/auth/refresh`
19. حذف `style` از DOMPurify ALLOWED_ATTR
20. Open redirect protection در checkout

### 🔲 فاز ۵: پاکسازی و بهبود نهایی
21. حذف فایل‌های مرده (`api-response.ts`, `vite.config.ts`, فایل‌های دیباگ)
22. ادغام `/checkout` و `/order` یا حذف تکرار
23. اصلاح وابستگی‌ها (`autoprefixer` → dev, `eslint-config-next` بروزرسانی)
24. اضافه کردن schema validation (zod) به API routes
25. `fetchWithTimeout` signal composition با `AbortSignal.any()`
26. CSRF protection برای POST routes
27. محدود کردن `/api/health` به IPهای داخلی
28. افزودن retry logic به Zarinpal API calls

---

## 📊 مقایسه با بهترین شیوه‌ها

| بهترین شیوه | وضعیت قبلی | وضعیت فعلی | شکاف |
|------------|-----------|-----------|------|
| Server Components برای صفحات غیرتعاملی | ۳/۱۲ | ۸/۱۲ | 🟡 ۳۳% هنوز Client |
| Type Safety بدون `any` | ۱۷ مورد | **۰** | 🟢 کامل |
| Rate Limiting روی API routes | صفر | ۹/۱۱ | 🟡 refresh + health بدون |
| Authentication روی write routes | ۲/۴ | ۴/۴ | 🟢 کامل |
| ISR برای صفحات داینامیک | بدون ISR | ✅ revalidate=300 | 🟢 فعال |
| Image Optimization | `unoptimized: true` | ✅ next/image | 🟢 کامل |
| Dead code cleanup | ~۵ فایل | ۱ فایل باقی‌مانده | 🟡 api-response.ts |
| Centralized icon library | آیکون‌ها تکرار شده | ✅ icons/ مرکزی + inline SVGها | 🟡 هنوز تکرار |
| Error monitoring | بدون | Structured logger (بدون Sentry) | 🟡 |
| Proper CSP | unsafe-eval + unsafe-inline | nonce-based + unsafe-eval | 🟡 p5.js نیاز دارد |
| GraphQL proxy security | بدون | بدون allowlisting | 🔴 باز |
| Refresh token | بدون | ✅ /api/auth/refresh | 🟢 فعال |
| Health check | بدون | ✅ /api/health | 🟢 فعال |
| Structured logging | console.error | ✅ JSON logger | 🟢 فعال |

---

## 🏁 نتیجه‌گیری

پروژه NewModernVIRA پس از ۳ فاز بهبود، از امتیاز **۶.۸/۱۰** به **۷.۸/۱۰** ارتقا یافته است. مهم‌ترین دستاوردها:

**✅ بهبودهای تکمیل شده:**
- حذف ~۴۴.۵MB وابستگی مرده (Three.js)
- صفر `any` type در کل codebase
- Rate limiting روی ۹ مسیر API
- احراز هویت کامل روی write routes
- ISR برای صفحات محصول
- بهینه‌سازی تصاویر با `next/image`
- ۵ صفحه تبدیل به Server Components
- CSP nonce-based
- Structured JSON logging
- Refresh token rotation
- Health check endpoint
- Env validation در startup

**⚠️ موارد باقی‌مانده بحرانی:**
- GraphQL proxy بدون query allowlisting — خطر امنیتی بالا
- `vira_auth_user` cookie بدون امضا — spoofing ممکن

**🎯 پیشنهاد:** اجرای فاز ۴ (امنیت و زیرساخت) برای رفع ۲ مشکل بحرانی و ۵ هشدار باقی‌مانده می‌تواند امتیاز پروژه را به **۸.۵/۱۰** ارتقا دهد.

---

**تحلیلگر:** Architect Agent  
**تاریخ اولیه:** 1404/03/14  
**تاریخ بروزرسانی:** 1404/03/18  
**نسخه:** 2.0  
**پروژه:** NewModernVIRA (فروشگاه ویرا)
