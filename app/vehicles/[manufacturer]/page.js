// ISR Configuration: Incremental Static Regeneration
// Pre-render pages for all manufacturers and revalidate every 5 minutes
export const revalidate = 300;

import { getVehicles, createSlug } from '@/lib/vehicles';
import Link from 'next/link';
import VehicleImageCard from '@/app/components/VehicleImageCard';

export async function generateMetadata({ params }) {
  const { manufacturer } = await params;
  const decodedManufacturer = manufacturer
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${decodedManufacturer} Vehicles - Number1 Motors`,
    description: `Browse our collection of ${decodedManufacturer} vehicles. Quality vehicles available at Number1 Motors New Zealand.`,
    keywords: `${decodedManufacturer} vehicles, ${decodedManufacturer} cars, buy ${decodedManufacturer}, Number1 Motors`,
    openGraph: {
      title: `${decodedManufacturer} Vehicles - Number1 Motors`,
      description: `Browse quality ${decodedManufacturer} vehicles`,
      type: 'website',
    },
  };
}

/**
 * generateStaticParams: Pre-render pages for all manufacturers
 * Dynamically generates routes for each unique manufacturer
 */
export async function generateStaticParams() {
  try {
    const vehicles = await getVehicles();
    const manufacturers = [...new Set(vehicles.map((v) => v.manufacturer))];
    
    return manufacturers.map((manufacturer) => ({
      manufacturer: createSlug(manufacturer),
    }));
  } catch (error) {
    console.error('[ISR] Error generating static params for manufacturers:', error);
    return [];
  }
}

export default async function ManufacturerPage({ params }) {
  const { manufacturer } = await params;
  
  const vehicles = await getVehicles();
  
  // Filter vehicles by manufacturer using slug comparison
  const manufacturerVehicles = vehicles.filter(
    (v) => createSlug(v.manufacturer) === manufacturer
  );

  // Get display name from first vehicle or decode from slug
  const decodedManufacturer = manufacturerVehicles.length > 0
    ? manufacturerVehicles[0].manufacturer
    : manufacturer
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

  // Get unique models for this manufacturer
  const models = [...new Set(manufacturerVehicles.map((v) => v.model))].sort();

  if (manufacturerVehicles.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        {/* Breadcrumb */}
        <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2 text-gray-600 text-sm">
          <Link href="/vehicles" className="text-red-600 hover:text-red-700 font-medium">
            Vehicles
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">{decodedManufacturer}</span>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center bg-gray-50 rounded-lg p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{decodedManufacturer}</h2>
            <p className="text-gray-600">No vehicles found for this manufacturer.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-8 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6 text-red-100 text-sm">
            <Link href="/vehicles" className="hover:text-white transition-colors">
              Vehicles
            </Link>
            <span className="text-red-200">/</span>
            <span className="font-semibold text-white">{decodedManufacturer}</span>
          </nav>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">{decodedManufacturer}</h1>
          <p className="text-lg sm:text-xl text-red-100">
            {manufacturerVehicles.length} vehicle{manufacturerVehicles.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Models Grid */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Models</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
            {models.map((model) => {
              const modelVehicles = manufacturerVehicles.filter((v) => v.model === model);
              const modelSlug = createSlug(model);
              
              return (
                <Link
                  key={model}
                  href={`/vehicles/${manufacturer}/${modelSlug}`}
                >
                  <div className="bg-white border-2 border-gray-200 hover:border-red-600 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-lg group">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-red-600 mb-3">
                      {model}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-semibold text-gray-900">Available:</span> {modelVehicles.length} vehicle{modelVehicles.length !== 1 ? 's' : ''}</p>
                      {modelVehicles.length > 0 && (
                        <p><span className="font-semibold text-gray-900">Years:</span> {Math.min(...modelVehicles.map((v) => parseInt(v.year)))} - {Math.max(...modelVehicles.map((v) => parseInt(v.year)))}</p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* All Vehicles for Manufacturer */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">All {decodedManufacturer} Vehicles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {manufacturerVehicles.map((vehicle) => {
              const modelSlug = createSlug(vehicle.model);
              return (
                <Link key={vehicle.id} href={`/vehicles/${manufacturer}/${modelSlug}/${vehicle.id}`}>
                  <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
                    {/* Image */}
                    <VehicleImageCard 
                      src={vehicle.thumbnailImage} 
                      alt={`${vehicle.year} ${vehicle.model}`}
                      vehicleData={vehicle}
                    />

                    {/* Content */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors flex-1">
                          {vehicle.year} {vehicle.model}
                          {vehicle.variant && ` ${vehicle.variant}`}
                        </h3>
                        {vehicle.status && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full whitespace-nowrap">
                            {vehicle.status}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 mb-4 space-y-2 text-sm text-gray-600">
                        <p><span className="font-semibold">Stock:</span> {vehicle.stockNo}</p>
                        <p><span className="font-semibold">Engine:</span> {vehicle.engineSize}cc {vehicle.fuelType}</p>
                        <p><span className="font-semibold">Mileage:</span> {vehicle.mileage} {vehicle.mileageUnit}</p>
                      </div>

                      {vehicle.price && (
                        <div className="text-xl sm:text-2xl font-bold text-red-600 mb-3">{vehicle.price}</div>
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
        </section>
      </div>
    </div>
  );
}
