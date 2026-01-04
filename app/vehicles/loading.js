/**
 * Loading Skeleton for /vehicles page
 * Displayed while the page is being generated or fetched
 * Provides a smooth user experience during ISR revalidation
 */
export default function LoadingVehicles() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Skeleton */}
        <div className="mb-12">
          <div className="h-14 bg-red-100 rounded-lg mb-4 w-3/4 animate-pulse"></div>
          <div className="h-6 bg-red-100 rounded-lg w-1/2 animate-pulse"></div>
        </div>

        {/* Filters Skeleton */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 mb-8 shadow-sm">
          <div className="mb-6">
            <div className="h-12 bg-red-200 rounded-lg animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-12 bg-red-200 rounded-lg animate-pulse"></div>
            <div className="h-12 bg-red-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Results Count Skeleton */}
        <div className="h-5 bg-red-100 rounded w-1/3 mb-8 animate-pulse"></div>

        {/* Vehicle Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-red-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Title Skeleton */}
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-red-100 rounded animate-pulse"></div>
                  <div className="h-5 bg-red-100 rounded w-4/5 animate-pulse"></div>
                </div>
                <div className="h-6 bg-red-100 rounded-lg w-24 animate-pulse"></div>
              </div>

              {/* Details Skeleton */}
              <div className="space-y-3 mb-4 flex-1">
                <div className="h-4 bg-red-50 rounded animate-pulse"></div>
                <div className="h-4 bg-red-50 rounded animate-pulse"></div>
                <div className="h-4 bg-red-50 rounded animate-pulse"></div>
                <div className="h-4 bg-red-50 rounded w-4/5 animate-pulse"></div>
              </div>

              {/* Price Skeleton */}
              <div className="h-8 bg-red-200 rounded mb-4 w-1/2 animate-pulse"></div>

              {/* Button Skeleton */}
              <div className="h-5 bg-red-100 rounded pt-4 border-t border-red-200 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
