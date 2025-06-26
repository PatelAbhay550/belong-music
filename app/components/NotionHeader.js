"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function NotionHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowMobileSearch(false);
      setSearchQuery("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
    if (e.key === 'Escape') {
      setShowMobileSearch(false);
    }
  };

  // Get current page title based on pathname
  const getPageTitle = () => {
    if (pathname === '/') return 'Music Dashboard';
    if (pathname === '/liked') return 'Liked Songs';
    if (pathname.startsWith('/search')) return 'Search';
    if (pathname.startsWith('/playlist')) return 'Playlist';
    if (pathname.match(/^\/[^\/]+$/)) return 'Song Details';
    return 'Music Dashboard';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between md:pl-6 pl-16">
      {/* Left side - Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Link href="/" className="hover:text-gray-900 transition-colors">
          🏠 Home
        </Link>
        <span>/</span>
        <span className="text-gray-900">{getPageTitle()}</span>
      </div>

      {/* Center - Search Bar */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <div className={`relative transition-all duration-200 ${isSearchFocused ? 'scale-105' : ''}`}>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search songs, artists, albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onKeyDown={handleKeyDown}
              className={`w-full px-4 py-2 pl-10 pr-4 text-sm border rounded-lg transition-all duration-200 ${
                isSearchFocused 
                  ? 'border-blue-300 ring-2 ring-blue-100 bg-white' 
                  : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
              }`}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className={`w-4 h-4 transition-colors ${isSearchFocused ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-3">
        {/* Quick Search Button for mobile */}
        <button 
          onClick={() => setShowMobileSearch(true)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* Share */}
        <button className="hidden md:block px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
          Share
        </button>

        {/* More options */}
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Mobile Search Modal */}
      {showMobileSearch && isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="bg-white h-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Search Music</h2>
              <button
                onClick={() => setShowMobileSearch(false)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search songs, artists, albums..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="w-full px-4 py-3 pl-12 pr-4 text-base border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                {searchQuery.trim() && (
                  <button
                    type="submit"
                    className="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Search
                  </button>
                )}
              </form>
            </div>

            {/* Quick Search Suggestions */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Popular Searches</h3>
              <div className="space-y-2">
                {['Hindi Songs', 'English Songs', 'Punjabi Music', 'Classical', 'Latest Hits'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setSearchQuery(suggestion);
                      router.push(`/search?q=${encodeURIComponent(suggestion)}`);
                      setShowMobileSearch(false);
                    }}
                    className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    🔍 {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
