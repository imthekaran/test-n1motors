/**
 * Loading Skeleton for /vehicles/[manufacturer] page
 * Displayed while manufacturer vehicles page is being generated
 */
export default function LoadingManufacturer() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb Skeleton */}
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-8 animate-pulse"></div>

        {/* Header Skeleton */}
        <div className="mb-12">
          <div className="h-14 bg-gray-200 rounded mb-4 w-1/2 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </div>

        {/* Models Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="space-y-3 mb-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-5 bg-gray-200 rounded pt-4 border-t border-gray-200 animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* All Vehicles Section Header */}
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-8 animate-pulse"></div>

        {/* Vehicles Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl"
            >
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-white/20 rounded animate-pulse"></div>
                  <div className="h-4 bg-white/20 rounded w-4/5 animate-pulse"></div>
                </div>
                <div className="h-6 bg-white/20 rounded-lg w-16 animate-pulse"></div>
              </div>
              <div className="space-y-2 mb-4 flex-1">
                <div className="h-3 bg-white/10 rounded animate-pulse"></div>
                <div className="h-3 bg-white/10 rounded animate-pulse"></div>
                <div className="h-3 bg-white/10 rounded animate-pulse"></div>
              </div>
              <div className="h-6 bg-white/20 rounded w-1/2 mb-4 animate-pulse"></div>
              <div className="h-4 bg-white/10 rounded pt-4 border-t border-white/10 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
