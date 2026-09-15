# Tech Stack

## Language

TypeScript, end to end.

## Architecture

Single Next.js application (App Router) -- server and client React components in
one codebase, Route Handlers for the API (`app/api/*`), Server Actions for forms
and auth. No separate backend service. The product catalog itself isn't fetched
from a database at request time either -- it's plain TypeScript data compiled
into the app at build time (see Data storage) -- so there's no CMS layer to run
or deploy separately.

## Framework

Next.js 16 (App Router), React 19.

## Styling & UI

Tailwind CSS v4 for styling, Framer Motion for animation/page transitions, Lenis
for smooth scroll.

## Data storage

Supabase (Postgres + Auth) for anything genuinely dynamic: user accounts, orders,
and a few lead-capture tables (corporate enquiries, career applications, guest
checkout leads). Row Level Security is the real authorization boundary, not
application code.

The product catalog, coupons, and homepage content are not database-backed --
they're plain exported TypeScript in `config/*.ts`, committed to git. Adding a
product means editing `config/products.ts`, the same as any other code change.

## Client state

Zustand -- small, localStorage-persisted stores for cart, wishlist, and shop
filters. No Redux, no global Context.

## Payments

Razorpay -- server creates the order and recomputes every price from
`config/products.ts` (never trusts the client), then verifies payment via an
HMAC-SHA256 signature check server-side before marking an order paid.

## Media

Cloudflare Images (photos) and Cloudflare Stream (video). Config files store an
opaque Cloudflare ID only; URL-building goes through `lib/cloudflareImages.ts`
and `lib/cloudflareStream.ts`, with a custom Next.js image loader for responsive
`srcset`s. A legacy Cloudinary integration still exists for older images not yet
migrated.

## Email

Resend -- order confirmation (customer) and order notification (internal) emails.

## Package manager

npm (matches the existing `package.json`/`package-lock.json` convention).

## Build

Next.js build (Turbopack in dev via `next dev --turbopack`), type-checked via
`tsc --noEmit` (see existing `tsconfig.json`).

## Hosting

Vercel (implied by `@vercel/analytics` usage and the legacy `/store/*` redirect
config in `next.config.ts`).
