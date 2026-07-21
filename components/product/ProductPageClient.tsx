'use client'

import { useState }     from 'react'
import { ImageGallery } from './ImageGallery'
import { ProductInfo }  from './ProductInfo'
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

  // A variant with its own `images` gallery gets a fresh, color-scoped
  // thumbnail strip (reset to the first shot of that color). Variants
  // without one fall back to the legacy flat `product.images` array,
  // indexed by color — unchanged behavior for every existing product.
  const variantImages = product.variants[colorIndex]?.images
  const galleryImages       = variantImages && variantImages.length > 0 ? variantImages : product.images
  const galleryActiveIndex  = variantImages && variantImages.length > 0 ? 0 : colorIndex

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 lg:gap-20">
      <div className="md:sticky md:top-24 md:self-start">
        <ImageGallery
          images={galleryImages}
          productName={product.name}
          activeColorIndex={galleryActiveIndex}
        />
      </div>
      <div>
        <ProductInfo
          product={product}
          defaultColor={defaultColor}
          onColorChange={setColorIndex}
        />
      </div>
    </div>
  )
}
