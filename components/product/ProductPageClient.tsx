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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 lg:gap-20">
      <div className="md:sticky md:top-24 md:self-start">
        <ImageGallery
          images={product.images}
          productName={product.name}
          activeColorIndex={colorIndex}
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
