'use client';

/**
 * Error Boundary for /vehicles/[manufacturer]/[model] page
 * Catches errors during rendering of the model vehicles page
 */
export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur-xl p-8 rounded-2xl border border-red-500/30 shadow-xl">
          <h2 className="text-3xl font-bold text-red-200 mb-4">⚠️ Something went wrong</h2>
          
          <p className="text-slate-300 mb-6">
            We encountered an error while loading the model vehicles.
          </p>

          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 mb-8">
            <p className="text-xs font-mono text-red-300 break-words">
              {error?.message || 'Unknown error occurred'}
            </p>
          </div>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
            
            <a
              href="/vehicles"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40"
            >
              Back to Vehicles
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
