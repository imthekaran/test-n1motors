// ISR Configuration: Incremental Static Regeneration
// - revalidate: Auto-regenerate every 300 seconds (5 minutes) after it's been generated
// - generateStaticParams: Pre-render all vehicle detail pages at build time
// This ensures fast page loads and automatic updates when the XML data changes
export const revalidate = 300;

import { getVehicles, getVehicleById, createSlug } from '@/lib/vehicles';
import Link from 'next/link';
import Image from 'next/image';
import ImageGallery from '@/app/components/ImageGallery';

export async function generateMetadata({ params }) {
  const { id, manufacturer, model } = await params;
  const vehicle = await getVehicleById(id);

  if (!vehicle) {
    return {
      title: 'Vehicle Not Found - Number1 Motors',
      description: 'The vehicle you are looking for is not available.',
    };
  }

  return {
    title: `${vehicle.year} ${vehicle.manufacturer} ${vehicle.model} - Number1 Motors`,
    description: `${vehicle.year} ${vehicle.manufacturer} ${vehicle.model}. ${vehicle.description || 'Quality vehicles available at Number1 Motors New Zealand.'}`,
    keywords: `${vehicle.year} ${vehicle.manufacturer} ${vehicle.model}, buy ${vehicle.model}, Number1 Motors`,
    openGraph: {
      title: `${vehicle.year} ${vehicle.manufacturer} ${vehicle.model} - Number1 Motors`,
      description: `Quality ${vehicle.year} ${vehicle.manufacturer} ${vehicle.model} vehicle`,
      type: 'website',
    },
  };
}

/**
 * generateStaticParams: Pre-render all vehicle pages at build time
 * This function is called during the build process to generate static pages
 * for every vehicle ID, enabling fast static delivery and automatic ISR
 */
export async function generateStaticParams() {
  try {
    const vehicles = await getVehicles();
    // Return array of vehicle IDs with manufacturer and model for static pre-rendering
    return vehicles.map((vehicle) => ({
      manufacturer: createSlug(vehicle.manufacturer),
      model: createSlug(vehicle.model),
      id: vehicle.id,
    }));
  } catch (error) {
    console.error('[ISR] Error generating static params:', error);
    // Return empty array on error to allow build to continue
    return [];
  }
}

export default async function VehicleDetailPage({ params }) {
  const { id, manufacturer, model } = await params;
  const vehicle = await getVehicleById(id);

  // Decode manufacturer and model names - use vehicle data if available, otherwise decode from slug
  const decodedManufacturer = vehicle 
    ? vehicle.manufacturer
    : manufacturer
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

  const decodedModel = vehicle
    ? vehicle.model
    : model
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

  if (!vehicle) {
    return (
      <div className="bg-white min-h-screen">
        {/* Breadcrumb */}
        <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2 text-gray-600 text-sm flex-wrap">
          <Link href="/vehicles" className="text-red-600 hover:text-red-700 font-medium">
            Vehicles
          </Link>
          <span className="text-gray-400">/</span>
          <Link href={`/vehicles/${manufacturer}`} className="text-red-600 hover:text-red-700 font-medium">
            {decodedManufacturer}
          </Link>
          <span className="text-gray-400">/</span>
          <Link href={`/vehicles/${manufacturer}/${model}`} className="text-red-600 hover:text-red-700 font-medium">
            {decodedModel}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">Details</span>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center bg-gray-50 rounded-lg p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Vehicle Not Found</h1>
            <p className="text-gray-600 mb-8">The vehicle you're looking for doesn't exist.</p>
            <Link href="/vehicles" className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
              Browse All Vehicles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-8 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6 text-red-100 text-sm flex-wrap">
            <Link href="/vehicles" className="hover:text-white transition-colors">
              Vehicles
            </Link>
            <span className="text-red-200">/</span>
            <Link href={`/vehicles/${manufacturer}`} className="hover:text-white transition-colors">
              {decodedManufacturer}
            </Link>
            <span className="text-red-200">/</span>
            <Link href={`/vehicles/${manufacturer}/${model}`} className="hover:text-white transition-colors">
              {decodedModel}
            </Link>
            <span className="text-red-200">/</span>
            <span className="font-semibold text-white">Details</span>
          </nav>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
            {vehicle.year} {vehicle.manufacturer} {vehicle.model}
            {vehicle.variant && ` ${vehicle.variant}`}
          </h1>
          {vehicle.status && (
            <span className="inline-block px-4 py-2 bg-red-500/20 text-red-100 rounded-lg text-sm font-bold border border-red-500/30">
              {vehicle.status}
            </span>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">

        {/* Image Gallery */}
        <div className="mb-8 sm:mb-12">
          <ImageGallery images={vehicle.images} vehicleName={`${vehicle.year} ${vehicle.manufacturer} ${vehicle.model}`} imageCount={vehicle.imageCount} />
        </div>

        {/* Key Specs Row */}
        {(vehicle.engineSize || vehicle.bodyStyle || vehicle.mileage || vehicle.color || vehicle.fuelType || vehicle.transmission) && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 pb-8 border-b border-gray-200">
            {vehicle.engineSize && vehicle.engineSize !== '0' && (
              <div className="text-center">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Engine</p>
                <p className="text-lg font-bold text-gray-900">{vehicle.engineSize}cc</p>
              </div>
            )}
            {vehicle.bodyStyle && (
              <div className="text-center">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Body</p>
                <p className="text-lg font-bold text-gray-900">{vehicle.bodyStyle}</p>
              </div>
            )}
            {vehicle.mileage && vehicle.mileage !== '0' && (
              <div className="text-center">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Odometer</p>
                <p className="text-lg font-bold text-gray-900">{vehicle.mileage} {vehicle.mileageUnit}</p>
              </div>
            )}
            {vehicle.color && (
              <div className="text-center">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Colour</p>
                <p className="text-lg font-bold text-gray-900">{vehicle.color}</p>
              </div>
            )}
            {vehicle.fuelType && (
              <div className="text-center">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Fuel Type</p>
                <p className="text-lg font-bold text-gray-900">{vehicle.fuelType}</p>
              </div>
            )}
            {vehicle.transmission && (
              <div className="text-center">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Transmission</p>
                <p className="text-lg font-bold text-gray-900">{vehicle.transmission}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-8">
          {/* Description Section */}
          {vehicle.description && (
            <section className="bg-gray-50 p-6 sm:p-8 rounded-lg border border-gray-200">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 pb-4 border-b border-red-200">Description</h2>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-6">{vehicle.description}</p>
              
              {/* Features as bullet points */}
              {vehicle.exteriorFeatures && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Key Features</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {vehicle.exteriorFeatures.split(',').map((feature, idx) => (
                      <li key={idx} className="text-gray-700 flex items-start">
                        <span className="text-red-600 font-bold mr-3">✓</span>
                        {feature.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* All Specifications - Combined Section */}
          {(vehicle.stockNo || vehicle.year || vehicle.bodyStyle || vehicle.mileage || vehicle.dealership || vehicle.vin || 
            vehicle.engineSize || vehicle.fuelType || vehicle.transmission || vehicle.driveSystem || vehicle.turbo ||
            vehicle.interiorColor || vehicle.seats || vehicle.seatMaterial || vehicle.airbags ||
            vehicle.color || vehicle.exteriorFeatures || vehicle.interiorFeatures || vehicle.regNo || vehicle.purchaseDate) && (
            <section className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 pb-4 border-b border-red-200">Specifications & Details</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {/* Stock & Vehicle Info */}
                {vehicle.stockNo && (
                  <div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Stock No.</p>
                    <p className="text-gray-900 font-semibold">{vehicle.stockNo}</p>
                  </div>
                )}
                {vehicle.year && (
                  <div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Year</p>
                    <p className="text-gray-900 font-semibold">{vehicle.year}</p>
                  </div>
                )}
                {vehicle.bodyStyle && (
                  <div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Body Style</p>
                    <p className="text-gray-900 font-semibold">{vehicle.bodyStyle}</p>
                  </div>
                )}
                {vehicle.mileage && vehicle.mileage !== '0' && (
                  <div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Mileage</p>
                    <p className="text-gray-900 font-semibold">{vehicle.mileage} {vehicle.mileageUnit}</p>
                  </div>
                )}
                {vehicle.color && (
                  <div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Color</p>
                    <p className="text-gray-900 font-semibold">{vehicle.color}</p>
                  </div>
                )}
                {vehicle.dealership && (
                  <div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Dealership</p>
                    <p className="text-gray-900 font-semibold">{vehicle.dealership}</p>
                  </div>
                )}
                {vehicle.vin && (
                  <div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">VIN</p>
                    <p className="text-gray-900 font-semibold">{vehicle.vin}</p>
                  </div>
                )}

                {/* Engine & Performance */}
                {vehicle.engineSize && vehicle.engineSize !== '0' && (
                  <div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Engine Size</p>
                    <p className="text-gray-900 font-semibold">{vehicle.engineSize}cc</p>
                  </div>
                )}
                {vehicle.fuelType && (
                  <div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Fuel Type</p>
                    <p className="text-gray-900 font-semibold">{vehicle.fuelType}</p>
                  </div>
                )}
                {vehicle.transmission && (
                  <div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Transmission</p>
                    <p className="text-gray-900 font-semibold">{vehicle.transmission}</p>
                  </div>
                )}
                {vehicle.driveSystem && (
                  <div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Drive System</p>
                    <p className="text-gray-900 font-semibold">{vehicle.driveSystem}</p>
                  </div>
                )}
                {vehicle.turbo && (
                  <div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Turbo</p>
                    <p className="text-gray-900 font-semibold">{vehicle.turbo}</p>
                  </div>
                )}

                {/* Interior */}
                {vehicle.interiorColor && (
                  <div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Interior Color</p>
                    <p className="text-gray-900 font-semibold">{vehicle.interiorColor}</p>
                  </div>
                )}
                {vehicle.seats && (
                  <div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Seats</p>
                    <p className="text-gray-900 font-semibold">{vehicle.seats}</p>
                  </div>
                )}
                {vehicle.seatMaterial && (
                  <div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Seat Material</p>
                    <p className="text-gray-900 font-semibold">{vehicle.seatMaterial}</p>
                  </div>
                )}
                {vehicle.airbags && (
                  <div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Airbags</p>
                    <p className="text-gray-900 font-semibold">{vehicle.airbags}</p>
                  </div>
                )}

                {/* Additional Info */}
                {vehicle.regNo && (
                  <div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Registration No.</p>
                    <p className="text-gray-900 font-semibold">{vehicle.regNo}</p>
                  </div>
                )}
                {vehicle.purchaseDate && (
                  <div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Purchase Date</p>
                    <p className="text-gray-900 font-semibold">{vehicle.purchaseDate}</p>
                  </div>
                )}
              </div>

              {/* Features - Full Width */}
              {(vehicle.exteriorFeatures || vehicle.interiorFeatures) && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  {vehicle.exteriorFeatures && (
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Exterior Features</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {vehicle.exteriorFeatures.split(',').map((feature, idx) => (
                          <div key={idx} className="text-gray-700 flex items-start">
                            <span className="text-red-600 font-bold mr-3">✓</span>
                            {feature.trim()}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {vehicle.interiorFeatures && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Interior Features</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {vehicle.interiorFeatures.split(',').map((feature, idx) => (
                          <div key={idx} className="text-gray-700 flex items-start">
                            <span className="text-red-600 font-bold mr-3">✓</span>
                            {feature.trim()}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <Link href={`/vehicles/${manufacturer}/${model}`} className="inline-block text-red-600 font-semibold hover:text-red-700 transition-colors">
            ← Back to {decodedModel}
          </Link>
        </div>
      </div>
    </div>
  );
}
