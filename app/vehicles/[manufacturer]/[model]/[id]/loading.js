/**
 * Loading Skeleton for /vehicles/[manufacturer]/[model]/[id] (vehicle detail page)
 * Displayed while the vehicle detail page is being generated or fetched
 * Provides smooth UX during ISR revalidation
 */
export default function LoadingVehicleDetail() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb Skeleton */}
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-8 animate-pulse"></div>

        {/* Header Section Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 pb-8 border-b border-gray-200 mb-8">
          <div className="flex-1 w-full">
            {/* Title Skeleton */}
            <div className="space-y-3 mb-4">
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-4/5 animate-pulse"></div>
            </div>
            {/* Status Badge Skeleton */}
            <div className="h-8 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
          </div>
          {/* Price Skeleton */}
          <div className="h-12 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>

        {/* Content Sections Skeleton */}
        <div className="space-y-8">
          {/* Overview Section */}
          <div className="bg-gray-50 border border-gray-200 p-8 rounded-lg shadow-sm">
            <div className="h-8 bg-gray-200 rounded mb-6 w-1/3 animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-4/5 animate-pulse"></div>
            </div>
          </div>

          {/* Key Details Section */}
          <div className="bg-gray-50 border border-gray-200 p-8 rounded-lg shadow-sm">
            <div className="h-8 bg-gray-200 rounded mb-6 w-1/3 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 p-5 rounded-lg"
                >
                  <div className="h-3 bg-gray-200 rounded mb-3 w-2/3 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Engine Section */}
          <div className="bg-gray-50 border border-gray-200 p-8 rounded-lg shadow-sm">
            <div className="h-8 bg-gray-200 rounded mb-6 w-1/3 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 p-5 rounded-lg"
                >
                  <div className="h-3 bg-gray-200 rounded mb-3 w-2/3 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Interior Section */}
          <div className="bg-gray-50 border border-gray-200 p-8 rounded-lg shadow-sm">
            <div className="h-8 bg-gray-200 rounded mb-6 w-1/3 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 p-5 rounded-lg"
                >
                  <div className="h-3 bg-gray-200 rounded mb-3 w-2/3 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <div className="h-6 bg-gray-200 rounded w-40 mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
