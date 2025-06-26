"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import NotionHeader from "../components/NotionHeader";
import NotionSidebar from "../components/NotionSidebar";
import NotionMusicCard from "../components/NotionMusicCard";
import Loading from "../components/Loading";

const ArtistSearchContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Search for artists
  const searchArtists = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      const { data } = await axios.get(
        `https://jiosavan-api-with-playlist.vercel.app/api/search/artists?query=${encodeURIComponent(query)}&page=1&limit=20`
      );
      setArtists(data?.data?.results || []);
    } catch (error) {
      console.error("Error searching artists:", error);
      toast.error("Failed to search artists");
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Update URL with search query
      const newUrl = `/artist?q=${encodeURIComponent(searchQuery)}`;
      router.push(newUrl);
      searchArtists(searchQuery);
    }
  };

  // Search on initial load if query exists
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
      searchArtists(query);
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen bg-white">
      <Toaster position="top-right" />
      <NotionSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden md:ml-0 ml-0">
        <NotionHeader />
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-4 md:p-8">
            
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Search Artists
              </h1>
              <p className="text-gray-600">
                Discover your favorite artists and explore their music
              </p>
            </div>

            {/* Search Form */}
            <div className="mb-8">
              <form onSubmit={handleSearch} className="max-w-2xl">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for artists..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-12">
                <Loading />
              </div>
            )}

            {/* Search Results */}
            {!loading && hasSearched && (
              <div>
                {artists.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Artists ({artists.length})
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                      {artists.map((artist, index) => (
                        <motion.div
                          key={artist.id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                          className="group cursor-pointer"
                          onClick={() => router.push(`/artist/${artist.id}`)}
                        >
                          <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 group-hover:border-gray-300">
                            <div className="aspect-square rounded-lg overflow-hidden mb-4">
                              <Image
                                src={artist.image?.[2]?.url || artist.image?.[1]?.url || artist.image?.[0]?.url || "/LOGO.svg"}
                                alt={artist.name || "Artist"}
                                width={200}
                                height={200}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                            <div className="text-center">
                              <h3 className="font-medium text-gray-900 truncate mb-1">
                                {artist.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {artist.followerCount ? `${artist.followerCount.toLocaleString()} followers` : 'Artist'}
                              </p>
                              {artist.dominantType && (
                                <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                  {artist.dominantType}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No artists found</h3>
                    <p className="text-gray-500">
                      Try searching with different keywords or check your spelling
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Welcome State */}
            {!hasSearched && !loading && (
              <div className="text-center py-16">
                <svg className="w-20 h-20 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Favorite Artists</h2>
                <p className="text-gray-600 mb-8">
                  Search for artists by name and discover their music, albums, and songs
                </p>
                
                {/* Popular Artists Suggestions */}
                <div className="max-w-md mx-auto">
                  <p className="text-sm text-gray-500 mb-4">Popular searches:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["Arijit Singh", "A.R. Rahman", "Shreya Ghoshal", "Atif Aslam", "Rahat Fateh"].map((artist) => (
                      <button
                        key={artist}
                        onClick={() => {
                          setSearchQuery(artist);
                          searchArtists(artist);
                          router.push(`/artist?q=${encodeURIComponent(artist)}`);
                        }}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                      >
                        {artist}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ArtistSearchPage = () => {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-white">
        <NotionSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loading />
        </div>
      </div>
    }>
      <ArtistSearchContent />
    </Suspense>
  );
};

export default ArtistSearchPage;
