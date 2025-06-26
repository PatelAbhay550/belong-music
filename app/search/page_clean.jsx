"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import NotionHeader from "../components/NotionHeader";
import NotionSidebar from "../components/NotionSidebar";
import NotionSection from "../components/NotionSection";
import NotionMusicCard from "../components/NotionMusicCard";
import Loading from "../components/Loading";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  const [searchResults, setSearchResults] = useState({
    songs: [],
    albums: [],
    artists: [],
    playlists: []
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (query) {
      searchMusic(query);
    }
  }, [query]);

  const searchMusic = async (searchQuery) => {
    setLoading(true);
    try {
      // Search for songs
      const songsRes = await axios.get(
        `https://jiosavan-api-with-playlist.vercel.app/api/search/songs?query=${searchQuery}&page=1&limit=20`
      );
      
      // Search for albums
      const albumsRes = await axios.get(
        `https://jiosavan-api-with-playlist.vercel.app/api/search/albums?query=${searchQuery}&page=1&limit=20`
      );
      
      // Search for artists
      const artistsRes = await axios.get(
        `https://jiosavan-api-with-playlist.vercel.app/api/search/artists?query=${searchQuery}&page=1&limit=20`
      );

      setSearchResults({
        songs: songsRes.data.data?.results || [],
        albums: albumsRes.data.data?.results || [],
        artists: artistsRes.data.data?.results || [],
        playlists: []
      });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'all', label: 'All', count: '' },
    { id: 'songs', label: 'Songs', count: searchResults.songs.length },
    { id: 'albums', label: 'Albums', count: searchResults.albums.length },
    { id: 'artists', label: 'Artists', count: searchResults.artists.length },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-20">
          <Loading />
        </div>
      );
    }

    if (!query) {
      return (
        <div className="text-center py-20">
          <div className="mb-6">
            <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Search for music</h2>
            <p className="text-gray-500">Find your favorite songs, albums, and artists</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'songs':
        return searchResults.songs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {searchResults.songs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <NotionMusicCard item={song} type="song" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No songs found for "{query}"</p>
          </div>
        );
      case 'albums':
        return searchResults.albums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {searchResults.albums.map((album, index) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <NotionMusicCard item={album} type="album" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No albums found for "{query}"</p>
          </div>
        );
      case 'artists':
        return searchResults.artists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {searchResults.artists.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <NotionMusicCard item={artist} type="artist" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No artists found for "{query}"</p>
          </div>
        );
      default:
        return (
          <div className="space-y-12">
            {/* Songs Section */}
            {searchResults.songs.length > 0 && (
              <NotionSection title="Songs" icon="🎵">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {searchResults.songs.slice(0, 8).map((song, index) => (
                    <motion.div
                      key={song.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <NotionMusicCard item={song} type="song" />
                    </motion.div>
                  ))}
                </div>
              </NotionSection>
            )}

            {/* Albums Section */}
            {searchResults.albums.length > 0 && (
              <NotionSection title="Albums" icon="💿">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {searchResults.albums.slice(0, 8).map((album, index) => (
                    <motion.div
                      key={album.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <NotionMusicCard item={album} type="album" />
                    </motion.div>
                  ))}
                </div>
              </NotionSection>
            )}

            {/* Artists Section */}
            {searchResults.artists.length > 0 && (
              <NotionSection title="Artists" icon="🎤">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {searchResults.artists.slice(0, 8).map((artist, index) => (
                    <motion.div
                      key={artist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <NotionMusicCard item={artist} type="artist" />
                    </motion.div>
                  ))}
                </div>
              </NotionSection>
            )}

            {/* No results */}
            {searchResults.songs.length === 0 && 
             searchResults.albums.length === 0 && 
             searchResults.artists.length === 0 && (
              <div className="text-center py-20">
                <div className="mb-6">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6M7 8h10a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V10a2 2 0 012-2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No results found</h3>
                  <p className="text-gray-500">Try different keywords or check your spelling</p>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <NotionSidebar />
      
      <div className="flex-1 flex flex-col">
        <NotionHeader />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {query && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">🔍</span>
                  <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
                </div>
                <p className="text-gray-600 mb-6">Results for "{query}"</p>
                
                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 w-fit">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.label}
                      {tab.count > 0 && activeTab !== tab.id && (
                        <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded-full">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex">
        <NotionSidebar />
        <div className="flex-1 flex flex-col md:ml-0 ml-0">
          <NotionHeader />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto px-6 py-8">
              <div className="flex justify-center py-20">
                <Loading />
              </div>
            </div>
          </main>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
