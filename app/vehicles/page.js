// ISR Configuration: Incremental Static Regeneration
// Revalidate every 5 minutes to keep vehicle listings fresh
export const revalidate = 300;
// Set dynamic to false to enable static generation
export const dynamic = 'force-static';

import Link from 'next/link';
import { Metadata } from 'next';
import { getVehicles, createSlug } from '@/lib/vehicles';
import VehicleImageCard from '@/app/components/VehicleImageCard';
import ManufacturerCarousel from '@/app/components/ManufacturerCarousel';

/**
 * generateMetadata: SEO metadata for the vehicles listing page
 * Provides Open Graph, Twitter Card, and structured data for search engines
 */
export async function generateMetadata() {
  return {
    title: 'Browse Our Vehicles | Number1 Motors - Quality Used Cars NZ',
    description: 'Discover our extensive selection of quality used vehicles. Browse by manufacturer, price, mileage and year. Find your perfect car at Number1 Motors New Zealand.',
    keywords: 'used vehicles for sale, used cars NZ, quality vehicles, car dealership, Number1 Motors',
    alternates: {
      canonical: '/vehicles',
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: 'Browse Our Vehicles | Number1 Motors',
      description: 'Discover quality used vehicles at Number1 Motors. Browse our extensive collection online.',
      type: 'website',
      url: '/vehicles',
      siteName: 'Number1 Motors',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Number1 Motors - Quality Used Vehicles',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Browse Our Vehicles | Number1 Motors',
      description: 'Discover quality used vehicles at Number1 Motors.',
      images: ['/og-image.jpg'],
    },
  };
}

/**
 * VehiclesPage: Server component for efficient ISR
 * Fetches and renders vehicle listings with proper SEO and accessibility
 */
export default async function VehiclesPage() {
  let vehicles = [];
  let error = null;

  try {
    vehicles = await getVehicles();
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    error = err.message || 'Failed to load vehicles. Please try again later.';
  }

  const manufacturers = [...new Set(vehicles.map((v) => v.manufacturer))].sort();
  const vehicleCount = vehicles.length;

  if (error) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
            <h3 className="text-red-800 font-bold mb-2">Error Loading Vehicles</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Browse Our Vehicles</h1>
          <p className="text-lg sm:text-xl text-red-100 max-w-2xl">
            Discover quality vehicles from Number1 Motors. Find your perfect match today.
          </p>
          <div className="mt-4 text-red-100">
            <p><span className="font-semibold">{vehicleCount}</span> vehicles available</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Browse by Brand - Carousel */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Browse by Brand</h2>
          <ManufacturerCarousel manufacturers={manufacturers} vehicles={vehicles} />
        </section>

        {/* Results and Sorting Section */}
        <section className="mb-8 sm:mb-12">
          <div className="text-sm sm:text-base text-gray-600 mb-6">
            Showing <span className="font-bold text-gray-900">{vehicleCount}</span> quality vehicles
          </div>
        </section>

        {/* Vehicles Grid - Static Server-Rendered */}
        <section aria-label="Vehicle listings">
          {vehicleCount === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-lg text-gray-600">No vehicles available at this time. Please check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {vehicles.map((vehicle) => {
                const manufacturerSlug = createSlug(vehicle.manufacturer);
                const modelSlug = createSlug(vehicle.model);
                const vehicleTitle = `${vehicle.year} ${vehicle.manufacturer} ${vehicle.model}`;
                
                return (
                  <Link 
                    key={vehicle.id} 
                    href={`/vehicles/${manufacturerSlug}/${modelSlug}/${vehicle.id}`}
                    className="group"
                  >
                    <article 
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col"
                      itemScope
                      itemType="https://schema.org/Product"
                    >
                      {/* Structured Data for SEO */}
                      <meta itemProp="brand" content={vehicle.manufacturer} />
                      <meta itemProp="name" content={vehicleTitle} />
                      {vehicle.price && (
                        <>
                          <meta itemProp="price" content={vehicle.price.replace(/[^\d.]/g, '')} />
                          <meta itemProp="priceCurrency" content="NZD" />
                        </>
                      )}
                      <meta itemProp="url" content={`/vehicles/${manufacturerSlug}/${modelSlug}/${vehicle.id}`} />

                      {/* Image */}
                      <div className="relative w-full h-48 sm:h-56 bg-gray-100 overflow-hidden">
                        <VehicleImageCard
                          src={vehicle.thumbnailImage}
                          alt={vehicleTitle}
                          vehicleData={vehicle}
                          loading="lazy"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors flex-1">
                            {vehicleTitle}
                          </h3>
                          {vehicle.status && (
                            <span 
                              className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full whitespace-nowrap"
                              aria-label={`Status: ${vehicle.status}`}
                            >
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

                        <div className="text-center font-bold text-red-600 group-hover:text-red-700 transition-colors">
                          View Details →
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Structured Data - Schema.org BreadcrumbList */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': '/'
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Vehicles',
                'item': '/vehicles'
              }
            ]
          })}
        </script>

        {/* Structured Data - Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'Organization',
            'name': 'Number1 Motors',
            'url': 'https://number1motors.co.nz',
            'logo': '/logo.png',
            'description': 'Quality used vehicles dealer in New Zealand',
            'address': {
              '@type': 'PostalAddress',
              'addressCountry': 'NZ'
            }
          })}
        </script>
      </div>
    </div>
  );
}
