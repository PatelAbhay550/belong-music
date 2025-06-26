"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLikedSongs } from "../hooks/useLikedSongs";

export default function NotionSidebar() {
  const { likedSongs } = useLikedSongs();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { icon: "🏠", label: "Home", href: "/", active: true },
    { icon: "🔍", label: "Search", href: "/search" },
    { icon: "📚", label: "Library", href: "/library" },
    { icon: "❤️", label: `Liked Songs (${likedSongs.length})`, href: "/liked" },
    { icon: "📋", label: "Playlists", href: "/playlists" },
    { icon: "🎤", label: "Artists", href: "/artist" },
    { icon: "💿", label: "Albums", href: "/albums" },
  ];

  const recentItems = [
    { icon: "🎵", label: "Daily Mix 1" },
    { icon: "🔥", label: "Trending Hindi" },
    { icon: "🌙", label: "Chill Vibes" },
    { icon: "🏃", label: "Workout Mix" },
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Image
            src="/LOGO.svg"
            alt="Belong Logo"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <h1 className="font-semibold text-gray-900">Belong Music</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="p-3">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMobileMenu}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  item.active
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Recent */}
          <div className="mt-8">
            <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Recent
            </h3>
            <div className="space-y-1">
              {recentItems.map((item, index) => (
                <button
                  key={index}
                  onClick={closeMobileMenu}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Create New */}
          <div className="mt-8">
            <button 
              onClick={closeMobileMenu}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <span className="text-lg">➕</span>
              <span>Create Playlist</span>
            </button>
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm">👤</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">User</p>
            <p className="text-xs text-gray-500 truncate">Free Plan</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Hamburger Menu Button - Mobile Only */}
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-lg md:hidden"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${isMobile ? 'fixed' : 'relative'} 
        ${isMobile && !isMobileMenuOpen ? '-translate-x-full' : 'translate-x-0'}
        w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-screen transition-transform duration-300 ease-in-out z-40
      `}>
        <SidebarContent />
      </aside>
    </>
  );
}
