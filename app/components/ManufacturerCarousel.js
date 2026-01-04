'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { createSlug } from '@/lib/vehicles';

/**
 * ManufacturerCarousel: Client component for interactive carousel
 * Separated to keep server rendering efficient while allowing interactivity
 */
export default function ManufacturerCarousel({ manufacturers, vehicles }) {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div>
      {/* Carousel Container */}
      <div 
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4 -mx-4 px-4"
        style={{ scrollBehavior: 'smooth' }}
        role="region"
        aria-label="Browse by brand carousel"
      >
        {manufacturers.map((mfg) => {
          const mfgSlug = createSlug(mfg);
          const mfgVehicles = vehicles.filter((v) => v.manufacturer === mfg);
          return (
            <Link key={mfg} href={`/vehicles/${mfgSlug}`}>
              <div className="flex-shrink-0 w-48 bg-white border-2 border-gray-200 hover:border-red-600 rounded-lg p-5 transition-all duration-300 cursor-pointer group hover:shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors mb-2">
                  {mfg}
                </h3>
                <p className="text-gray-600 text-sm font-semibold">
                  {mfgVehicles.length} vehicle{mfgVehicles.length !== 1 ? 's' : ''}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Navigation Buttons - Below Carousel */}
      {manufacturers.length > 4 && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => scroll('left')}
            className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
            aria-label="Scroll manufacturer carousel left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
            aria-label="Scroll manufacturer carousel right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
