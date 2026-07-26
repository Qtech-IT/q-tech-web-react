import { useState } from 'react'
import { motion } from 'framer-motion'

import type {HTMLMotionProps} from 'framer-motion'
import defaultImage from '@/Assets/images/placeholders/default.jpg'

interface SafeImageProps extends Omit<HTMLMotionProps<'img'>, 'src' | 'alt'> {
  src?: string
  alt?: string
  fallback?: string
  placeholder?: string
  className?: string
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'image',
  fallback = defaultImage,
  placeholder = defaultImage,
  className = '',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src || placeholder)
  const [isLoaded, setIsLoaded] = useState(false)

  const handleError = () => setImgSrc(fallback)
  const handleLoad = () => setIsLoaded(true)

  return (
    <motion.img
      initial={{ opacity: 0.3 }}
      animate={{ opacity: isLoaded ? 1 : 0.3 }}
      transition={{ duration: 0.4 }}
      src={imgSrc}
      alt={alt}
      loading="lazy"
      onLoad={handleLoad}
      onError={handleError}
      className={`object-cover transition-all duration-500 ease-in-out ${className}`}
      {...props}
    />
  )
}
