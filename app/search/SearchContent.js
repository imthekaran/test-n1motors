'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import VehicleImageCard from '@/app/components/VehicleImageCard';

export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
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

    // Apply search filter - search by brand, model, and year
    // Support multiple search terms like "ford ranger 2021" or "ford ranger"
    if (query.trim()) {
      const searchTerms = query.toLowerCase().trim().split(/\s+/);
      
      filtered = filtered.filter((v) => {
        // All search terms must match somewhere in brand, model, or year
        return searchTerms.every(term => 
          v.manufacturer.toLowerCase().includes(term) ||
          v.model.toLowerCase().includes(term) ||
          v.year.includes(term)
        );
      });
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
  }, [query, sortBy, vehicles]);

  if (loading) return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Searching vehicles...</p>
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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Search Results</h1>
          <p className="text-lg sm:text-xl text-red-100">
            Results for: <span className="font-bold">"{query}"</span>
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Sort Section */}
        <section className="mb-8 sm:mb-12">
          <div className="flex items-center gap-4">
            <label htmlFor="sort" className="font-medium text-gray-900">Sort by:</label>
            <select 
              id="sort"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm sm:text-base cursor-pointer transition-colors"
              aria-label="Sort vehicles"
            >
              <option value="year">Newest First</option>
              <option value="mileage">Lowest Mileage</option>
              <option value="price">Price</option>
            </select>
          </div>
        </section>

        {/* Results Count */}
        <div className="mb-6 text-sm sm:text-base text-gray-600">
          Found <span className="font-bold text-gray-900">{filteredVehicles.length}</span> vehicle{filteredVehicles.length !== 1 ? 's' : ''} matching "{query}"
        </div>

        {/* Vehicles Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-lg text-gray-600 mb-4">No vehicles found matching your search.</p>
            <Link href="/vehicles" className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
              Browse All Vehicles
            </Link>
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
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div>
                          <p className="text-gray-600 font-medium">Price</p>
                          <p className="text-gray-900 font-bold">${parseFloat(vehicle.price).toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">Mileage</p>
                          <p className="text-gray-900 font-bold">{parseInt(vehicle.mileage).toLocaleString()} mi</p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex items-center justify-between text-xs text-gray-600 mt-auto pt-3 border-t border-gray-200">
                        <span>Stock: {vehicle.stockNumber}</span>
                        <span className="text-red-600 font-semibold group-hover:text-red-700">View Details →</span>
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
