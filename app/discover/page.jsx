"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import NotionHeader from "../components/NotionHeader";
import NotionSidebar from "../components/NotionSidebar";
import NotionSection from "../components/NotionSection";
import NotionMusicCard from "../components/NotionMusicCard";
import NotionPlayerBar from "../components/NotionPlayerBar";
import { useLikedSongs } from "../hooks/useLikedSongs";
import { useRecentlyPlayed } from "../hooks/useRecentlyPlayed";

export default function DiscoverWeeklyPage() {
  const { isLiked, toggleLike } = useLikedSongs();
  const { addToRecentlyPlayed } = useRecentlyPlayed();
  const [discoverSongs, setDiscoverSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchDiscoverSongs();
  }, []);

  const fetchDiscoverSongs = async () => {
    try {
      // Fetch discover weekly from trending songs with some randomization
      const response = await fetch('https://jiosaavan-harsh-patel.vercel.app/modules?language=hindi');
      const data = await response.json();
      
      if (data.status === 'SUCCESS' && data.data?.trending?.songs) {
        // Shuffle and take 30 songs for discover weekly
        const songs = data.data.trending.songs;
        const shuffled = songs.sort(() => 0.5 - Math.random());
        setDiscoverSongs(shuffled.slice(0, 30));
      }
    } catch (error) {
      console.error('Error fetching discover songs:', error);
      toast.error('Failed to load discover weekly');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (song, index) => {
    setCurrentSong(song);
    setIsPlaying(true);
    addToRecentlyPlayed(song);
  };

  const handleLike = (song) => {
    const wasLiked = isLiked(song.id);
    toggleLike(song);
    
    if (wasLiked) {
      toast.success(`Removed "${song.name}" from liked songs`);
    } else {
      toast.success(`Added "${song.name}" to liked songs`);
    }
  };

  const getWeekDateRange = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    
    return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex">
        <NotionSidebar />
        <div className="flex-1 flex flex-col md:ml-0 ml-0">
          <NotionHeader />
          <main className="flex-1 overflow-y-auto flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm">Discovering new music for you...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      <Toaster position="top-right" />
      <NotionSidebar />
      
      <div className="flex-1 flex flex-col md:ml-0 ml-0">
        <NotionHeader />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">🔍</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Discover Weekly</h1>
                  <p className="text-gray-500 text-sm">Your personalized weekly music recommendations</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{discoverSongs.length} songs</span>
                <span>•</span>
                <span>Week of {getWeekDateRange()}</span>
                <span>•</span>
                <span>Updated every Monday</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <button
                onClick={() => discoverSongs.length > 0 && handlePlay(discoverSongs[0], 0)}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                disabled={discoverSongs.length === 0}
              >
                <span>▶️</span>
                <span>Play All</span>
              </button>
              <button
                onClick={fetchDiscoverSongs}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <span>🔄</span>
                <span>Refresh</span>
              </button>
            </motion.div>

            {/* Discover Songs */}
            {discoverSongs.length > 0 ? (
              <NotionSection title="Your Weekly Discoveries" icon="✨">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {discoverSongs.map((song, index) => (
                    <motion.div
                      key={song.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.02 }}
                    >
                      <NotionMusicCard 
                        item={song} 
                        type="song" 
                        index={index + 1}
                        onPlay={(songItem, songIndex) => handlePlay(songItem, index)}
                        isPlaying={currentSong?.id === song.id && isPlaying}
                        onLike={handleLike}
                        isLiked={isLiked(song.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </NotionSection>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load discoveries</h2>
                <p className="text-gray-500 mb-6">Try refreshing to get your weekly recommendations</p>
                <button 
                  onClick={fetchDiscoverSongs}
                  className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  <span className="mr-2">🔄</span>
                  Refresh
                </button>
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* Audio Player */}
      {currentSong && isPlaying && (
        <NotionPlayerBar 
          song={currentSong}
          isLiked={isLiked(currentSong.id)}
          onLike={() => handleLike(currentSong)}
          onDownload={() => {}}
        />
      )}
    </div>
  );
}
