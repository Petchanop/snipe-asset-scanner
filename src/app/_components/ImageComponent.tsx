'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function ImageComponent(props: { src: string , alt: string, width : number, height : number }) {
  const { src, alt, width, height } = props
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <>
      {
        imageError ?
          "Image failed to load"
          :
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            onError={handleImageError}
          />
      }
    </>
  )
}