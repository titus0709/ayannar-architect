import Image from "next/image"
import type { Image as SanityImageType } from "sanity"

import { urlFor } from "@/sanity/lib/image"

type Props = {
  image: SanityImageType & { alt?: string }
  alt?: string
  width: number
  height: number
  className?: string
  sizes?: string
  priority?: boolean
  quality?: number
}

export function SanityImage({
  image,
  alt,
  width,
  height,
  className,
  sizes,
  priority,
  quality = 82,
}: Props) {
  if (!image?.asset) return null

  const src = urlFor(image).width(width).height(height).quality(quality).url()
  const lqip = urlFor(image).width(24).quality(20).blur(50).url()

  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt ?? image.alt ?? ""}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      blurDataURL={lqip}
      className={className}
    />
  )
}
