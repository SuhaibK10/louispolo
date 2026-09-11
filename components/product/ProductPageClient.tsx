'use client'

import { useState, useEffect } from 'react'
import { ImageGallery } from './ImageGallery'
import { ProductInfo }  from './ProductInfo'
import { pdpUrl, PLACEHOLDER_URL } from '@/lib/cloudflareImages'
import type { Product } from '@/types'

interface Props {
  product:       Product
  defaultColor?: string
}

export function ProductPageClient({ product, defaultColor }: Props) {
  const defaultIndex = defaultColor
    ? Math.max(0, product.variants.findIndex(
        v => v.color.toLowerCase() === defaultColor.toLowerCase()
      ))
    : 0

  const [colorIndex, setColorIndex] = useState(defaultIndex)

  // Hovering a swatch in ProductInfo previews that color's gallery without
  // actually selecting it — cart/price/URL all stay tied to colorIndex.
  const [hoveredColorIndex, setHoveredColorIndex] = useState<number | null>(null)
  const previewColorIndex = hoveredColorIndex ?? colorIndex

  // Which photo (within the current color) the main gallery shows — lifted
  // up from ImageGallery so the desktop thumbnail strip, which now renders
  // inside ProductInfo instead (a sibling component), can drive the exact
  // same gallery state a click in either location.
  const [activeAngle, setActiveAngle] = useState(0)

  // Warm the cache for every OTHER color's first photo as soon as the page
  // loads — not just the one currently shown. So by the time someone clicks
  // a color swatch, that swap is a cache hit instead of a cold fetch.
  useEffect(() => {
    product.variants.forEach((v, i) => {
      if (i === colorIndex) return
      const firstImage = v.images?.[0] ?? product.images[i] ?? product.images[0]
      if (!firstImage) return
      const preload = new window.Image()
      preload.src = pdpUrl(firstImage, product.imageFit) || PLACEHOLDER_URL
    })
    // Only needs to run once per product page load — re-running on every
    // color change would keep re-fetching the color just switched away from.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product])

  // Warm every OTHER angle of every color too — not just each color's first
  // shot above. Without this, switching to a new color feels fast (its first
  // photo is already warm) but clicking through *that* color's remaining
  // thumbnails right after is a cold fetch each time, since ImageGallery only
  // starts preloading a gallery once it actually becomes the active one.
  // Deferred one frame past mount (idle callback, falling back to a short
  // timeout on browsers without it) so this doesn't compete with the initial
  // photo/thumbnail requests for connection slots.
  useEffect(() => {
    const run = () => {
      product.variants.forEach((v) => {
        const gallery = v.images?.length ? v.images : product.images
        // Skip index 0 — it's either already loading as the current hero
        // photo, or already covered by the first-photo preload above. Every
        // index past 0 never gets the cover-fit treatment (see ImageGallery's
        // `fitFor`), so no fit param is needed here.
        gallery.slice(1).forEach((img) => {
          const preload = new window.Image()
          preload.src = pdpUrl(img) || PLACEHOLDER_URL
        })
      })
    }
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number }
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(run)
      return () => (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id)
    }
    const id = setTimeout(run, 300)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product])

  // A variant with its own `images` gallery gets a fresh, color-scoped
  // thumbnail strip (reset to the first shot of that color). Variants
  // without one fall back to the legacy flat `product.images` array,
  // indexed by color — unchanged behavior for every existing product.
  const variantImages = product.variants[previewColorIndex]?.images
  const galleryImages       = variantImages && variantImages.length > 0 ? variantImages : product.images
  const galleryActiveIndex  = variantImages && variantImages.length > 0
    ? Math.min(activeAngle, variantImages.length - 1)
    : previewColorIndex

  // Keep `activeAngle` in sync with `galleryActiveIndex`: for a product with
  // its own per-variant images, switching color does NOT reset which angle
  // is showing — but it IS clamped to the new color's own photo count,
  // since colors can have different numbers of angles (e.g. one color with
  // 4 photos, another with 3) and an unclamped index would point past the
  // end of the shorter gallery, crashing ImageGallery. For a legacy product
  // sharing one flat `product.images` array indexed by color, this fires on
  // every hover/click, since colour and photo are the same index there.
  useEffect(() => { setActiveAngle(galleryActiveIndex) }, [galleryActiveIndex])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 lg:gap-20">
      <div className="md:sticky md:top-24 md:self-start">
        <ImageGallery
          images={galleryImages}
          productName={product.name}
          active={activeAngle}
          onActiveChange={setActiveAngle}
          recentPurchases={product.recentPurchases}
          imageFit={product.imageFit}
          videoYoutubeId={product.variants[previewColorIndex]?.demoVideoYoutubeId ?? product.demoVideoYoutubeId}
          videoStreamId={product.demoVideoId}
        />
      </div>
      <div>
        <ProductInfo
          product={product}
          defaultColor={defaultColor}
          onColorChange={setColorIndex}
          onColorHover={setHoveredColorIndex}
          galleryActiveAngle={activeAngle}
          onGalleryAngleChange={setActiveAngle}
        />
      </div>
    </div>
  )
}
