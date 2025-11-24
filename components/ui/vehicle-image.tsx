'use client';

import { useState, useEffect } from 'react';

interface VehicleImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
}

export function VehicleImage({ src, alt, fill = false, className = '', sizes }: VehicleImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const fallbackSrc = 'https://via.placeholder.com/800x600/666666/FFFFFF?text=Immagine+non+disponibile';

  if (hasError || !src) {
    const containerClass = fill 
      ? 'absolute inset-0 bg-muted flex items-center justify-center' 
      : 'w-full h-full bg-muted flex items-center justify-center';
    return (
      <div className={`${containerClass} ${className}`}>
        <p className="text-muted-foreground text-sm">Immagine non disponibile</p>
      </div>
    );
  }

  // Usa img tag normale invece di Next.js Image per immagini remote (più affidabile in locale)
  const imgClass = fill 
    ? `absolute inset-0 w-full h-full object-cover ${className}`
    : `w-full h-full object-cover ${className}`;

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={imgClass}
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        } else {
          setHasError(true);
        }
      }}
      loading="lazy"
    />
  );
}

