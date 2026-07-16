// ─────────────────────────────────────────────────────────────────────────────
// app/(store)/shop/slug/page.tsx
// Product Detail Page (PDP).
// Reads slug from URL, finds product in config/products.ts, renders.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata }       from 'next'
import { notFound }            from 'next/navigation'
import Link                    from 'next/link'
import { ChevronLeft }         from 'lucide-react'
import { getProductBySlug, PRODUCTS } from '@/config/products'
import { ProductPageClient }   from '@/components/product/ProductPageClient'
import { ProductStory }        from '@/components/product/ProductDetails'
import { ROUTES }              from '@/lib/constants'

interface Props {
  params:      Promise<{ slug: string }>
  searchParams: Promise<{ color?: string }>
}

export async function generateStaticParams() {
  return PRODUCTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug }  = await params
  const product   = getProductBySlug(slug)
  if (!product) return { title: 'Product not found' }
  return {
    title:       product.metaTitle ?? product.name,
    description: product.metaDescription ?? product.description,
    keywords:    product.keywords,
    alternates:  { canonical: `/shop/${slug}` },
  }
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug }  = await params
  const { color } = await searchParams
  const product   = getProductBySlug(slug)

  if (!product) notFound()

  return (
    <div className="pt-16 md:pt-[4.5rem]">
      <div className="container-lp section-pad pt-6! md:pt-8!">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 md:mb-10">
          <Link
            href={ROUTES.shop}
            className="flex items-center gap-1 font-body text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-lp-muted)] hover:text-[var(--color-lp-gold)] transition-colors duration-200"
          >
            <ChevronLeft size={13} strokeWidth={1.5} />
            All Products
          </Link>
          <span className="text-[var(--color-lp-border)]">/</span>
          <span className="font-body text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-lp-ink)]">
            {product.name}
          </span>
        </div>

        {/* PDP grid */}
        <ProductPageClient product={product} defaultColor={color} />

        {/* Long-form editorial detail */}
        <ProductStory product={product} />

      </div>
    </div>
  )
}
