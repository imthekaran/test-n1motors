'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterManufacturer, setFilterManufacturer] = useState('');
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
        {/* Manufacturers Grid */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Browse by Brand</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {manufacturers.map((mfg) => {
              const mfgSlug = mfg.toLowerCase().replace(/\s+/g, '-');
              const mfgVehicles = vehicles.filter((v) => v.manufacturer === mfg);
              return (
                <Link key={mfg} href={`/vehicles/${mfgSlug}`}>
                  <div className="bg-white border-2 border-gray-200 hover:border-red-600 rounded-lg p-4 sm:p-5 cursor-pointer transition-all duration-300 hover:shadow-lg group">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-red-600 mb-2">
                      {mfg}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {mfgVehicles.length} vehicle{mfgVehicles.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Filters */}
        <section className="mb-8 sm:mb-12">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search by manufacturer, model, or stock number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 sm:px-6 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-600 text-sm sm:text-base"
              aria-label="Search vehicles"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <select
                value={filterManufacturer}
                onChange={(e) => setFilterManufacturer(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-600 text-sm sm:text-base cursor-pointer bg-white"
                aria-label="Filter by manufacturer"
              >
                <option value="">All Manufacturers</option>
                {manufacturers.map((mfg) => (
                  <option key={mfg} value={mfg}>
                    {mfg}
                  </option>
                ))}
              </select>

              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-600 text-sm sm:text-base cursor-pointer bg-white"
                aria-label="Sort vehicles"
              >
                <option value="year">Newest First</option>
                <option value="mileage">Lowest Mileage</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>
        </section>

        {/* Results Count */}
        <div className="mb-6 text-sm sm:text-base text-gray-600">
          Showing <span className="font-bold text-gray-900">{filteredVehicles.length}</span> of <span className="font-bold text-gray-900">{vehicles.length}</span> vehicles
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
                    <div className="relative w-full h-48 sm:h-56 bg-gray-100 overflow-hidden">
                      <Image
                        src={vehicle.thumbnailImage}
                        alt={`${vehicle.year} ${vehicle.manufacturer} ${vehicle.model}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

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
