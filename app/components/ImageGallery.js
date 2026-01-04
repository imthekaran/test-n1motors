'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

export default function ImageGallery({ images, vehicleName, imageCount }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState(new Set());
  
  // Calculate actual loaded image count
  // Since we generate 4 formats per image (jpg, jpeg, png, webp),
  // we need to count unique image numbers that have at least one format loaded
  const getActualImageCount = () => {
    const loadedImageNumbers = new Set();
    images.forEach((_, index) => {
      // Each image slot has 4 variants, so divide index by 4 to get the image number
      const imageNumber = Math.floor(index / 4);
      if (!failedImages.has(index)) {
        loadedImageNumbers.add(imageNumber);
      }
    });
    return loadedImageNumbers.size;
  };
  
  const actualImageCount = getActualImageCount() || imageCount || images.length;

  // Handle image errors - mark as failed and don't retry
  const handleImageError = useCallback((index) => {
    setFailedImages((prev) => new Set([...prev, index]));
  }, []);

  // Get the best image to display for current selection
  // If the current index failed, try other variants of the same image number
  const getDisplayImage = () => {
    // If current selection is good, use it
    if (selectedImageIndex < images.length && !failedImages.has(selectedImageIndex)) {
      return selectedImageIndex;
    }
    
    // Current image failed, try other variants of the same image number
    const currentImageNumber = Math.floor(selectedImageIndex / 4);
    const startIndex = currentImageNumber * 4;
    for (let i = startIndex; i < startIndex + 4; i++) {
      if (i < images.length && !failedImages.has(i)) {
        return i;
      }
    }
    
    // All variants failed, find next working image
    return findNextWorkingImage(selectedImageIndex, 1);
  };

  // Get list of images that haven't failed yet
  const availableImages = images.filter((_, idx) => !failedImages.has(idx));

  const handleThumbnailClick = useCallback((imageNumber) => {
    // Find the first working variant of this image number
    // Image numbers are 0-based, so image 1 has indices 0-3, image 2 has indices 4-7, etc.
    const startIndex = imageNumber * 4;
    for (let i = startIndex; i < startIndex + 4; i++) {
      if (i < images.length && !failedImages.has(i)) {
        setSelectedImageIndex(i);
        return;
      }
    }
    // Fallback: if no working variant found, set to first variant anyway
    setSelectedImageIndex(startIndex);
  }, [failedImages, images.length]);

  // Helper to find next/previous working image
  const findNextWorkingImage = (currentIndex, direction) => {
    const currentImageNumber = Math.floor(currentIndex / 4);
    let nextImageNumber = direction > 0 ? currentImageNumber + 1 : currentImageNumber - 1;
    
    // Wrap around
    if (nextImageNumber < 0) {
      nextImageNumber = Math.floor((images.length - 1) / 4);
    } else if (nextImageNumber > Math.floor((images.length - 1) / 4)) {
      nextImageNumber = 0;
    }
    
    // Find first working variant of next image
    const startIndex = nextImageNumber * 4;
    for (let i = startIndex; i < startIndex + 4 && i < images.length; i++) {
      if (!failedImages.has(i)) {
        return i;
      }
    }
    return startIndex; // Fallback
  };

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
            {(() => {
              const displayImageIndex = getDisplayImage();
              return displayImageIndex < images.length && (
                <Image
                  src={images[displayImageIndex]}
                  alt={`${vehicleName} - Image ${Math.floor(displayImageIndex / 4) + 1}`}
                  fill
                  className="object-contain"
                  priority
                  onError={() => {
                    handleImageError(displayImageIndex);
                  }}
                />
              );
            })()}
          </div>
          
          {/* Previous Button */}
          <button
            onClick={() => setSelectedImageIndex(findNextWorkingImage(selectedImageIndex, -1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 z-10"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={() => setSelectedImageIndex(findNextWorkingImage(selectedImageIndex, 1))}
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
              {Math.floor(selectedImageIndex / 4) + 1} / {actualImageCount}
            </div>
          )}
        </div>

        {/* Numbered Carousel - Bottom */}
        <div className="flex gap-2 overflow-x-auto pb-4 px-4 sm:px-6 lg:px-8">
          {[...Array(Math.ceil(images.length / 4))].map((_, imageNumber) => {
            // Find first working variant of this image number
            const startIndex = imageNumber * 4;
            const firstWorkingIndex = Array.from({ length: 4 }, (_, i) => startIndex + i)
              .find(i => i < images.length && !failedImages.has(i));
            
            if (firstWorkingIndex === undefined) return null;
            
            const selectedImageNumber = Math.floor(selectedImageIndex / 4);
            const image = images[firstWorkingIndex];
            
            return (
              <button
                key={`image-${imageNumber}`}
                onClick={() => handleThumbnailClick(imageNumber)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedImageNumber === imageNumber
                    ? 'border-red-600 ring-2 ring-red-600/50'
                    : 'border-gray-300 hover:border-red-600'
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${imageNumber + 1}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                  onError={() => {
                    handleImageError(firstWorkingIndex);
                  }}
                />
                {/* Number Badge */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white font-bold text-xs">{imageNumber + 1}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile: Main image with horizontal thumbnails below */}
      <div className="md:hidden space-y-4">
        {/* Main Image - Top with Navigation Buttons */}
        <div className="relative w-full bg-gray-100 overflow-hidden">
          <div className="relative w-full h-64 sm:h-80">
            {(() => {
              const displayImageIndex = getDisplayImage();
              return displayImageIndex < images.length && (
                <Image
                  src={images[displayImageIndex]}
                  alt={`${vehicleName} - Image ${Math.floor(displayImageIndex / 4) + 1}`}
                  fill
                  className="object-cover"
                  priority
                  onError={() => {
                    handleImageError(displayImageIndex);
                  }}
                />
              );
            })()}
          </div>
          
          {/* Previous Button */}
          <button
            onClick={() => setSelectedImageIndex(findNextWorkingImage(selectedImageIndex, -1))}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 z-10"
            aria-label="Previous image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={() => setSelectedImageIndex(findNextWorkingImage(selectedImageIndex, 1))}
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
              {Math.floor(selectedImageIndex / 4) + 1} / {actualImageCount}
            </div>
          )}
        </div>

        {/* Horizontal Thumbnails - Bottom */}
        {availableImages.length > 1 && (
          <div className="overflow-x-auto pb-4 px-4">
            <div className="flex gap-2">
              {[...Array(Math.ceil(images.length / 4))].map((_, imageNumber) => {
                // Find first working variant of this image number
                const startIndex = imageNumber * 4;
                const firstWorkingIndex = Array.from({ length: 4 }, (_, i) => startIndex + i)
                  .find(i => i < images.length && !failedImages.has(i));
                
                if (firstWorkingIndex === undefined) return null;
                
                const selectedImageNumber = Math.floor(selectedImageIndex / 4);
                const image = images[firstWorkingIndex];
                
                return (
                  <button
                    key={`mobile-image-${imageNumber}`}
                    onClick={() => handleThumbnailClick(imageNumber)}
                    className={`flex-shrink-0 relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImageNumber === imageNumber
                        ? 'border-red-600 ring-2 ring-red-600/50'
                        : 'border-gray-300 hover:border-red-600'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${imageNumber + 1}`}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-300"
                      onError={() => {
                        handleImageError(firstWorkingIndex);
                      }}
                    />
                    {/* Number Badge */}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white font-bold text-xs">{imageNumber + 1}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
