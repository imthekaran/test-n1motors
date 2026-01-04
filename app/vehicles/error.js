'use client';

import Link from 'next/link';

/**
 * Error Boundary for /vehicles page
 * Catches errors during rendering of the vehicle listing page
 * and displays a user-friendly error message with recovery options
 */
export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-red-50 p-8 rounded-lg border border-red-200 shadow-lg">
          <h2 className="text-3xl font-bold text-red-700 mb-4">⚠️ Something went wrong</h2>
          
          <p className="text-gray-700 mb-6">
            We encountered an error while loading the vehicle listings. This could be due to:
          </p>
          
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-8 ml-2">
            <li>A temporary issue with our vehicle data source</li>
            <li>Network connectivity problems</li>
            <li>Server-side processing error</li>
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
            
            <Link
              href="/"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
