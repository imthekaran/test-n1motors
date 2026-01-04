/**
 * Loading Skeleton for /vehicles/[manufacturer]/[model] page
 * Displayed while model vehicles page is being generated
 */
export default function LoadingModel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb Skeleton */}
        <div className="h-5 bg-white/20 rounded w-1/2 mb-8 animate-pulse"></div>

        {/* Header Skeleton */}
        <div className="mb-12">
          <div className="h-14 bg-white/20 rounded mb-4 w-2/3 animate-pulse"></div>
          <div className="h-5 bg-white/20 rounded w-1/4 animate-pulse"></div>
        </div>

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
