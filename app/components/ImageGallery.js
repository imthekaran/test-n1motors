'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

export default function ImageGallery({ images, vehicleName }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState(new Set());

  // Handle image errors - mark as failed and don't retry
  const handleImageError = useCallback((index) => {
    setFailedImages((prev) => new Set([...prev, index]));
  }, []);

  // Get list of images that haven't failed yet
  const availableImages = images.filter((_, idx) => !failedImages.has(idx));

  const handleThumbnailClick = useCallback((index) => {
    setSelectedImageIndex(index);
  }, []);

  // If all images failed to load, show coming soon
  if (availableImages.length === 0) {
    return (
      <section className="w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-gray-100 mb-8 sm:mb-12">
        <div className="relative w-full h-64 sm:h-96 flex items-center justify-center">
          <div className="text-center px-4">
            <svg className="w-16 sm:w-24 h-16 sm:h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Images Coming Soon</h3>
            <p className="text-sm sm:text-base text-gray-500">Vehicle images will be available shortly</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-screen relative left-1/2 right-1/2 -mx-[50vw] mb-8 sm:mb-12">
      {/* Desktop: Large main image with numbered carousel below */}
      <div className="hidden md:flex md:flex-col gap-4">
        {/* Main Image with Navigation Buttons */}
        <div className="relative w-full bg-gray-100 overflow-hidden" style={{ height: '80vh', maxHeight: '1000px' }}>
          <div className="relative w-full h-full">
            {selectedImageIndex < images.length && !failedImages.has(selectedImageIndex) && (
              <Image
                src={images[selectedImageIndex]}
                alt={`${vehicleName} - Image ${selectedImageIndex + 1}`}
                fill
                className="object-contain"
                priority
                onError={() => {
                  handleImageError(selectedImageIndex);
                }}
              />
            )}
          </div>
          
          {/* Previous Button */}
          <button
            onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 z-10"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={() => setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 z-10"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image Counter - Top Right */}
          {availableImages.length > 0 && (
            <div className="absolute top-4 right-4 bg-gray-900/80 text-white px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-sm">
              {selectedImageIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Numbered Carousel - Bottom */}
        <div className="flex gap-2 overflow-x-auto pb-4 px-4 sm:px-6 lg:px-8">
          {images.map((image, index) => (
            !failedImages.has(index) && (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedImageIndex === index
                    ? 'border-red-600 ring-2 ring-red-600/50'
                    : 'border-gray-300 hover:border-red-600'
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                  onError={() => {
                    handleImageError(index);
                  }}
                />
                {/* Number Badge */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white font-bold text-xs">{index + 1}</span>
                </div>
              </button>
            )
          ))}
        </div>
      </div>

      {/* Mobile: Main image with horizontal thumbnails below */}
      <div className="md:hidden space-y-4">
        {/* Main Image - Top with Navigation Buttons */}
        <div className="relative w-full bg-gray-100 overflow-hidden">
          <div className="relative w-full h-64 sm:h-80">
            {selectedImageIndex < images.length && !failedImages.has(selectedImageIndex) && (
              <Image
                src={images[selectedImageIndex]}
                alt={`${vehicleName} - Image ${selectedImageIndex + 1}`}
                fill
                className="object-cover"
                priority
                onError={() => {
                  handleImageError(selectedImageIndex);
                }}
              />
            )}
          </div>
          
          {/* Previous Button */}
          <button
            onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 z-10"
            aria-label="Previous image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={() => setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 z-10"
            aria-label="Next image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image Counter */}
          {availableImages.length > 0 && (
            <div className="absolute top-3 right-3 bg-gray-900/80 text-white px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-sm">
              {selectedImageIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Horizontal Thumbnails - Bottom */}
        {availableImages.length > 1 && (
          <div className="overflow-x-auto pb-4 px-4">
            <div className="flex gap-2">
              {images.map((image, index) => (
                !failedImages.has(index) && (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`flex-shrink-0 relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImageIndex === index
                        ? 'border-red-600 ring-2 ring-red-600/50'
                        : 'border-gray-300 hover:border-red-600'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-300"
                      onError={() => {
                        handleImageError(index);
                      }}
                    />
                    {/* Number Badge */}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white font-bold text-xs">{index + 1}</span>
                    </div>
                  </button>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
