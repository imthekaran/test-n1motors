'use client';

/**
 * Error Boundary for /vehicles/[manufacturer]/[model]/[id] (vehicle detail page)
 * Catches errors during rendering of individual vehicle detail pages
 * and provides recovery options
 */
export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-red-50 p-8 rounded-lg border border-red-200 shadow-lg">
          <h2 className="text-3xl font-bold text-red-700 mb-4">⚠️ Cannot Load Vehicle Details</h2>
          
          <p className="text-gray-700 mb-6">
            We had trouble loading the vehicle details you requested. This could happen if:
          </p>
          
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-8 ml-2">
            <li>The vehicle no longer exists in our database</li>
            <li>There was a temporary data source issue</li>
            <li>An invalid vehicle ID was provided</li>
          </ul>

          <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-8">
            <p className="text-xs font-mono text-red-700 break-words">
              {error?.message || 'Unknown error occurred'}
            </p>
          </div>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
            
            <a
              href="/vehicles"
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-all duration-300"
            >
              Back to Vehicles
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
