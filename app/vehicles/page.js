'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import VehicleImageCard from '@/app/components/VehicleImageCard';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('year');

  useEffect(() => {
    async function fetchVehicles() {
      try {
        setLoading(true);
        const response = await fetch('/api/vehicles');
        if (!response.ok) throw new Error('Failed to fetch vehicles');
        const data = await response.json();
        setVehicles(data);
        setFilteredVehicles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVehicles();
  }, []);

  useEffect(() => {
    let filtered = vehicles;

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'year':
          return parseInt(b.year) - parseInt(a.year);
        case 'mileage':
          return parseInt(a.mileage) - parseInt(b.mileage);
        case 'price':
          return parseFloat(b.price) - parseFloat(a.price);
        default:
          return 0;
      }
    });

    setFilteredVehicles(filtered);
  }, [sortBy, vehicles]);

  const manufacturers = [...new Set(vehicles.map((v) => v.manufacturer))].sort();
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

  if (loading) return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Loading vehicles...</p>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
          <h3 className="text-red-800 font-bold mb-2">Error Loading Vehicles</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Browse Our Vehicles</h1>
          <p className="text-lg sm:text-xl text-red-100 max-w-2xl">
            Discover quality vehicles from Number1 Motors. Find your perfect match today.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Browse by Brand - Carousel */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Browse by Brand</h2>
          <div>
            {/* Carousel Container */}
            <div 
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-4 -mx-4 px-4"
              style={{ scrollBehavior: 'smooth' }}
            >
              {manufacturers.map((mfg) => {
                const mfgSlug = mfg.toLowerCase().replace(/\s+/g, '-');
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
                  className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-colors"
                  aria-label="Scroll left"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-colors"
                  aria-label="Scroll right"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Results Count & Sort Section */}
        <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Results Count */}
          <div className="text-sm sm:text-base text-gray-600 order-2 sm:order-1">
            Showing <span className="font-bold text-gray-900">{filteredVehicles.length}</span> of <span className="font-bold text-gray-900">{vehicles.length}</span> vehicles
          </div>

          {/* Sort Section */}
          <div className="flex items-center gap-3 order-1 sm:order-2">
            <label htmlFor="sort" className="font-medium text-gray-900 whitespace-nowrap">Sort by:</label>
            <select 
              id="sort"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2 sm:py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm sm:text-base cursor-pointer transition-colors"
              aria-label="Sort vehicles"
            >
              <option value="year">Newest First</option>
              <option value="mileage">Lowest Mileage</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>

        {/* Vehicles Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-lg text-gray-600">No vehicles found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredVehicles.map((vehicle) => {
              const manufacturerSlug = vehicle.manufacturer.toLowerCase().replace(/\s+/g, '-');
              const modelSlug = vehicle.model.toLowerCase().replace(/\s+/g, '-');
              return (
                <Link key={vehicle.id} href={`/vehicles/${manufacturerSlug}/${modelSlug}/${vehicle.id}`}>
                  <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
                    {/* Image */}
                    <VehicleImageCard
                      src={vehicle.thumbnailImage}
                      alt={`${vehicle.year} ${vehicle.manufacturer} ${vehicle.model}`}
                      vehicleData={vehicle}
                    />

                    {/* Content */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors flex-1">
                          {vehicle.year} {vehicle.manufacturer} {vehicle.model}
                        </h3>
                        {vehicle.status && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full whitespace-nowrap">
                            {vehicle.status}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 mb-4 space-y-2 text-sm text-gray-600">
                        <p><span className="font-semibold text-gray-900">Stock:</span> {vehicle.stockNo}</p>
                        <p><span className="font-semibold text-gray-900">Style:</span> {vehicle.bodyStyle}</p>
                        <p><span className="font-semibold text-gray-900">Engine:</span> {vehicle.engineSize}cc {vehicle.fuelType}</p>
                        <p><span className="font-semibold text-gray-900">Mileage:</span> {vehicle.mileage} {vehicle.mileageUnit}</p>
                      </div>

                      {vehicle.price && (
                        <div className="text-2xl font-bold text-red-600 mb-3">{vehicle.price}</div>
                      )}

                      <div className="text-center font-bold text-red-600 group-hover:text-red-700">
                        View Details →
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
