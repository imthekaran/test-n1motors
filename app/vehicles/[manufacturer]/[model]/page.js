// ISR Configuration: Incremental Static Regeneration
// Pre-render pages for all manufacturer/model combinations and revalidate every 5 minutes
export const revalidate = 300;

import { getVehicles, createSlug } from '@/lib/vehicles';
import Link from 'next/link';
import VehicleImageCard from '@/app/components/VehicleImageCard';

export async function generateMetadata({ params }) {
  const { manufacturer, model } = await params;
  const decodedManufacturer = manufacturer
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const decodedModel = model
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${decodedManufacturer} ${decodedModel} - Number1 Motors`,
    description: `Browse ${decodedManufacturer} ${decodedModel} vehicles. Quality vehicles available at Number1 Motors New Zealand.`,
    keywords: `${decodedManufacturer} ${decodedModel}, buy ${decodedModel}, Number1 Motors`,
    openGraph: {
      title: `${decodedManufacturer} ${decodedModel} - Number1 Motors`,
      description: `Browse quality ${decodedManufacturer} ${decodedModel} vehicles`,
      type: 'website',
    },
  };
}

/**
 * generateStaticParams: Pre-render pages for all manufacturer/model combinations
 * Dynamically generates routes for each unique combination
 */
export async function generateStaticParams() {
  try {
    const vehicles = await getVehicles();
    const combinations = new Map();

    vehicles.forEach((vehicle) => {
      const manufacturerSlug = createSlug(vehicle.manufacturer);
      const modelSlug = createSlug(vehicle.model);
      
      if (!combinations.has(manufacturerSlug)) {
        combinations.set(manufacturerSlug, []);
      }
      
      if (!combinations.get(manufacturerSlug).includes(modelSlug)) {
        combinations.get(manufacturerSlug).push(modelSlug);
      }
    });

    const params = [];
    combinations.forEach((models, manufacturer) => {
      models.forEach((model) => {
        params.push({ manufacturer, model });
      });
    });

    return params;
  } catch (error) {
    console.error('[ISR] Error generating static params for models:', error);
    return [];
  }
}

export default async function ModelPage({ params }) {
  const { manufacturer, model } = await params;
  
  const vehicles = await getVehicles();
  
  // Filter vehicles by manufacturer and model using slug comparison
  const filteredVehicles = vehicles.filter(
    (v) =>
      createSlug(v.manufacturer) === manufacturer &&
      createSlug(v.model) === model
  );

  // Get display names from first matching vehicle or decode from slug
  const firstVehicle = filteredVehicles[0];
  const decodedManufacturer = firstVehicle 
    ? firstVehicle.manufacturer
    : manufacturer
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

  const decodedModel = firstVehicle
    ? firstVehicle.model
    : model
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

  if (filteredVehicles.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        {/* Breadcrumb */}
        <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2 text-gray-600 text-sm">
          <Link href="/vehicles" className="text-red-600 hover:text-red-700 font-medium">
            Vehicles
          </Link>
          <span className="text-gray-400">/</span>
          <Link href={`/vehicles/${manufacturer}`} className="text-red-600 hover:text-red-700 font-medium">
            {decodedManufacturer}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">{decodedModel}</span>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center bg-gray-50 rounded-lg p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{decodedManufacturer} {decodedModel}</h2>
            <p className="text-gray-600">No vehicles found for this model.</p>
          </div>
        </div>
      </div>
    );
  }

  // Sort by year (newest first)
  const sortedVehicles = [...filteredVehicles].sort(
    (a, b) => parseInt(b.year) - parseInt(a.year)
  );

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
            <Link href={`/vehicles/${manufacturer}`} className="hover:text-white transition-colors">
              {decodedManufacturer}
            </Link>
            <span className="text-red-200">/</span>
            <span className="font-semibold text-white">{decodedModel}</span>
          </nav>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">{decodedManufacturer} {decodedModel}</h1>
          <p className="text-lg sm:text-xl text-red-100">
            {sortedVehicles.length} vehicle{sortedVehicles.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sortedVehicles.map((vehicle) => {
            const modelSlug = createSlug(vehicle.model);
            return (
              <Link key={vehicle.id} href={`/vehicles/${manufacturer}/${model}/${vehicle.id}`}>
                <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
                  {/* Image */}
                  <VehicleImageCard 
                    src={vehicle.thumbnailImage} 
                    alt={`${vehicle.year} ${decodedModel}`}
                    vehicleData={vehicle}
                  />

                  {/* Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-3 mb-4">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                        {vehicle.year} {vehicle.variant || ''}
                      </h3>
                      {vehicle.status && (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-bold whitespace-nowrap">
                          {vehicle.status}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 mb-4 space-y-2 text-sm text-gray-600">
                      <p><span className="font-semibold text-gray-900">Stock:</span> {vehicle.stockNo}</p>
                      <p><span className="font-semibold text-gray-900">Style:</span> {vehicle.bodyStyle}</p>
                      <p><span className="font-semibold text-gray-900">Engine:</span> {vehicle.engineSize}cc {vehicle.fuelType}</p>
                      <p><span className="font-semibold text-gray-900">Trans:</span> {vehicle.transmission}</p>
                      <p><span className="font-semibold text-gray-900">Mileage:</span> {vehicle.mileage} {vehicle.mileageUnit}</p>
                    </div>

                    {vehicle.price && (
                      <div className="text-lg sm:text-xl font-bold text-red-600 mb-4">
                        {vehicle.price}
                      </div>
                    )}

                    <div className="text-center text-red-600 font-bold pt-4 border-t border-gray-200 group-hover:text-red-700 transition-colors">
                      View Details →
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
