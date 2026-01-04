'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());
  const router = useRouter();
  const headerRef = useRef(null);

  const handleImageError = (vehicleId) => {
    setFailedImages(prev => new Set([...prev, vehicleId]));
  };

  // Handle click outside to close dropdowns and menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch vehicles on mount
  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await fetch('/api/vehicles');
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
      }
    }
    fetchVehicles();
  }, []);

  // Generate suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const searchTerms = query.split(/\s+/);

    // Get matching vehicles
    const matches = vehicles.filter((v) => {
      return searchTerms.every(term =>
        v.manufacturer.toLowerCase().includes(term) ||
        v.model.toLowerCase().includes(term) ||
        v.year.includes(term)
      );
    });

    // Group by brand and model for better display
    const uniqueSuggestions = [];
    const seen = new Set();

    // First, show brand suggestions
    const brands = [...new Set(vehicles.map(v => v.manufacturer))];
    brands.forEach(brand => {
      if (brand.toLowerCase().includes(query) && !seen.has(`brand-${brand}`)) {
        uniqueSuggestions.push({ type: 'brand', value: brand });
        seen.add(`brand-${brand}`);
      }
    });

    // Then show matched vehicles
    matches.slice(0, 8).forEach((vehicle) => {
      const key = `${vehicle.manufacturer}-${vehicle.model}-${vehicle.year}`;
      if (!seen.has(key)) {
        uniqueSuggestions.push({
          type: 'vehicle',
          value: `${vehicle.year} ${vehicle.manufacturer} ${vehicle.model}`,
          id: vehicle.id,
          manufacturer: vehicle.manufacturer,
          model: vehicle.model,
          year: vehicle.year,
          thumbnailImage: vehicle.thumbnailImage,
        });
        seen.add(key);
      }
    });

    setSuggestions(uniqueSuggestions.slice(0, 10));
    setShowSuggestions(true);
  }, [searchQuery, vehicles]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'brand') {
      setSearchQuery(suggestion.value);
      router.push(`/search?q=${encodeURIComponent(suggestion.value)}`);
    } else {
      // Navigate directly to vehicle detail
      const manufacturerSlug = suggestion.manufacturer.toLowerCase().replace(/\s+/g, '-');
      const modelSlug = suggestion.model.toLowerCase().replace(/\s+/g, '-');
      router.push(`/vehicles/${manufacturerSlug}/${modelSlug}/${suggestion.id}`);
    }
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <header ref={headerRef} className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row */}
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-lg">N1</div>
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-lg text-gray-900">Number1</span>
              <span className="text-xs text-red-600 font-semibold -mt-1">MOTORS</span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:relative md:flex md:items-center md:w-96">
            <div className="relative flex-1">
              <input
                id="search-desktop"
                name="search"
                type="text"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSuggestions(true)}
                className="w-full px-5 py-3 bg-gray-900 border border-gray-700 rounded-l-lg placeholder-gray-500 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-base transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white border border-red-600 hover:border-red-700 rounded-r-lg transition-colors h-full flex items-center"
              aria-label="Search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Suggestions Dropdown - Desktop */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 border-t-0 rounded-b-lg shadow-lg z-10">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-5 py-4 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {suggestion.type === 'brand' ? (
                        <>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="font-medium text-gray-900">{suggestion.value}</p>
                            <p className="text-xs text-gray-500">Brand</p>
                          </div>
                        </>
                      ) : (
                        <>
                          {suggestion.thumbnailImage && !failedImages.has(suggestion.id) ? (
                            <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
                              <Image
                                src={suggestion.thumbnailImage}
                                alt={suggestion.value}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                                onError={() => handleImageError(suggestion.id)}
                              />
                            </div>
                          ) : null}
                          <div>
                            <p className="font-medium text-gray-900">{suggestion.value}</p>
                            <p className="text-xs text-gray-500">Vehicle</p>
                          </div>
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 ml-8">
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

        {/* Mobile Search Bar - Always visible */}
        <form onSubmit={handleSearch} className="md:hidden pb-4 relative flex">
          <div className="flex-1 relative">
            <input
              id="search-mobile"
              name="search"
              type="text"
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowSuggestions(true)}
              className="w-full px-5 py-3 bg-gray-900 border border-gray-700 rounded-l-lg placeholder-gray-500 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-base transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white border border-red-600 hover:border-red-700 rounded-r-lg transition-colors h-full flex items-center"
            aria-label="Search"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Suggestions Dropdown - Mobile */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 border-t-0 rounded-b-lg shadow-lg z-10 max-h-80 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-5 py-4 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {suggestion.type === 'brand' ? (
                      <>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">{suggestion.value}</p>
                          <p className="text-xs text-gray-500">Brand</p>
                        </div>
                      </>
                    ) : (
                      <>
                        {suggestion.thumbnailImage && !failedImages.has(suggestion.id) ? (
                          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
                            <Image
                              src={suggestion.thumbnailImage}
                              alt={suggestion.value}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                              onError={() => handleImageError(suggestion.id)}
                            />
                          </div>
                        ) : null}
                        <div>
                          <p className="font-medium text-gray-900">{suggestion.value}</p>
                          <p className="text-xs text-gray-500">Vehicle</p>
                        </div>
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
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
