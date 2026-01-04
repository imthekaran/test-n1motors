'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b-4 border-red-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-lg">N1</div>
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-lg text-gray-900">Number1</span>
              <span className="text-xs text-red-600 font-semibold -mt-1">MOTORS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/vehicles" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              Browse Vehicles
            </Link>
            <Link href="/#about" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              About
            </Link>
            <Link href="/#contact" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2 border-t border-gray-200">
            <Link href="/vehicles" className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
              Browse Vehicles
            </Link>
            <Link href="/#about" className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
              About
            </Link>
            <Link href="/#contact" className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
