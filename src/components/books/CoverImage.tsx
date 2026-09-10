"use client";

import { useEffect, useRef, useState } from "react";

interface CoverImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackText: string;
  fallbackClassName: string;
}

export default function CoverImage({
  src,
  alt,
  className,
  fallbackText,
  fallbackClassName,
}: CoverImageProps) {
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    setHasError(Boolean(image?.complete && image.naturalWidth === 0));
  }, [src]);

  if (!src || hasError) {
    return <div className={fallbackClassName}>{fallbackText}</div>;
  }

  return (
    <img
      ref={imageRef}
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
