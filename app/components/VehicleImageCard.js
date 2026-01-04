'use client';

import Image from 'next/image';
import { useState, useCallback } from 'react';

export default function VehicleImageCard({ src, alt, vehicleData }) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle image errors - set error state immediately and don't retry
  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  // Handle successful image load
  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  if (hasError) {
    return (
      <div className="relative w-full h-40 bg-gray-200 rounded-t-lg flex items-center justify-center">
        <div className="text-center">
          <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xs text-gray-500">No Image Available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-40 bg-gray-100 rounded-t-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        onError={handleError}
        onLoadingComplete={handleLoad}
        unoptimized={false}
        // Don't show placeholder to avoid repeated load attempts
        priority={false}
      />
    </div>
  );
}
