'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Helper function to create URL-safe slugs
function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with dashes
    .replace(/[^\w-]/g, '');         // Remove special characters except dashes
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterManufacturer, setFilterManufacturer] = useState('');
  const [sortBy, setSortBy] = useState('year');
  const carouselRef = useRef(null);

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

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (v) =>
          v.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.stockNo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply manufacturer filter
    if (filterManufacturer) {
      filtered = filtered.filter((v) => v.manufacturer === filterManufacturer);
    }

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
  }, [searchQuery, filterManufacturer, sortBy, vehicles]);

  const manufacturers = [...new Set(vehicles.map((v) => v.manufacturer))].sort();

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-600">Loading vehicles...</div>;
  if (error) return <div className="text-center py-12 px-4 bg-red-50 text-red-700 rounded-lg font-medium">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">Discover Your Perfect Vehicle</h1>
          <p className="text-red-100 text-lg">Browse our exclusive collection of premium vehicles</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Browse by Manufacturer - Carousel */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Browse by Manufacturer</h2>
          <div>
            {/* Carousel Container */}
            <div 
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-4 -mx-4 px-4"
              style={{ scrollBehavior: 'smooth' }}
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
        </div>
        
        {/* Filter & Search Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sm:p-8 mb-8">
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">Search Vehicle</label>
            <input
              type="text"
              placeholder="Search by manufacturer, model, or stock number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200 transition-all duration-300"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Filter by Manufacturer</label>
              <select
                value={filterManufacturer}
                onChange={(e) => setFilterManufacturer(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 cursor-pointer focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200 transition-all duration-300 font-medium"
              >
                <option value="">All Manufacturers</option>
                {manufacturers.map((mfg) => (
                  <option key={mfg} value={mfg}>
                    {mfg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Sort By</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 cursor-pointer focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200 transition-all duration-300 font-medium"
              >
                <option value="year">Sort by Year (Newest)</option>
                <option value="mileage">Sort by Mileage (Lowest)</option>
                <option value="price">Sort by Price (Highest)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="text-gray-700 mb-8 text-sm font-medium">
          Showing <span className="text-red-600 font-bold">{filteredVehicles.length}</span> of <span className="text-red-600 font-bold">{vehicles.length}</span> vehicles
        </div>

        {filteredVehicles.length === 0 ? (
          <div className="text-center py-16 px-4 bg-gray-50 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg text-lg">
            No vehicles found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredVehicles.map((vehicle) => {
              const manufacturerSlug = createSlug(vehicle.manufacturer);
              const modelSlug = createSlug(vehicle.model);
              return (
              <Link key={vehicle.id} href={`/vehicles/${manufacturerSlug}/${modelSlug}/${vehicle.id}`}>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-red-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col group">
                  {/* Vehicle Image */}
                  <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                    <Image
                      src={vehicle.thumbnailImage}
                      alt={`${vehicle.year} ${vehicle.manufacturer} ${vehicle.model}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23F3F4F6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="%239CA3AF" text-anchor="middle" dominant-baseline="middle"%3ENo Image Available%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <h2 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                        {vehicle.year} {vehicle.manufacturer} {vehicle.model}
                      </h2>
                      {vehicle.status && (
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold whitespace-nowrap border border-red-300">
                          {vehicle.status}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 mb-4 space-y-2">
                      <p className="text-gray-600 text-sm">
                        <span className="text-gray-500">Stock:</span> <span className="font-semibold text-gray-900">{vehicle.stockNo}</span>
                      </p>
                      <p className="text-gray-600 text-sm">
                        <span className="text-gray-500">Style:</span> <span className="font-semibold text-gray-900">{vehicle.bodyStyle}</span>
                      </p>
                      <p className="text-gray-600 text-sm">
                        <span className="text-gray-500">Engine:</span> <span className="font-semibold text-gray-900">{vehicle.engineSize}cc {vehicle.fuelType}</span>
                      </p>
                      <p className="text-gray-600 text-sm">
                        <span className="text-gray-500">Trans:</span> <span className="font-semibold text-gray-900">{vehicle.transmission}</span>
                      </p>
                      <p className="text-gray-600 text-sm">
                        <span className="text-gray-500">Mileage:</span> <span className="font-semibold text-gray-900">{vehicle.mileage} {vehicle.mileageUnit}</span>
                      </p>
                    </div>

                    {vehicle.price && (
                      <div className="text-2xl font-bold text-red-600 mb-4">{vehicle.price}</div>
                    )}

                    <div className="text-center text-red-600 font-bold pt-4 border-t border-gray-200 group-hover:text-red-700 transition-colors">
                      View Details →
                    </div>
                  </div>
                </div>
              </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
