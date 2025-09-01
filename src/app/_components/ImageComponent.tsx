'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function ImageComponent(props: { src: string | undefined , alt: string, width : number, height : number }) {
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
          src ?
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            onError={handleImageError}
            className="w-full h-auto"
          />
          : "No image display"
      }
    </>
  )
}