"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return <div className={fallbackClassName}>{fallbackText}</div>;
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
