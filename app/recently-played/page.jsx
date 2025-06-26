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

export default function RecentlyPlayedPage() {
  const { isLiked, toggleLike } = useLikedSongs();
  const { recentlyPlayed, clearRecentlyPlayed } = useRecentlyPlayed();
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (song, index) => {
    setCurrentSong(song);
    setIsPlaying(true);
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

  const handleClearAll = () => {
    if (recentlyPlayed.length > 0) {
      clearRecentlyPlayed();
      toast.success("Recently played history cleared");
    }
  };

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
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div className="flex items-center space-x-3 mb-4 md:mb-0">
                  <span className="text-2xl">🕐</span>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Recently Played</h1>
                    <p className="text-gray-500 text-sm">Continue listening to your recent tracks</p>
                  </div>
                </div>
                {recentlyPlayed.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              {recentlyPlayed.length > 0 && (
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{recentlyPlayed.length} song{recentlyPlayed.length !== 1 ? 's' : ''}</span>
                  <span>•</span>
                  <span>Last played: {new Date(recentlyPlayed[0]?.playedAt || Date.now()).toLocaleDateString()}</span>
                </div>
              )}
            </motion.div>

            {/* Recently Played Songs */}
            {recentlyPlayed.length > 0 ? (
              <NotionSection title="Your Recent Tracks" icon="🎵">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {recentlyPlayed.map((song, index) => (
                    <motion.div
                      key={`${song.id}-${song.playedAt}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <NotionMusicCard 
                        item={song} 
                        type="song" 
                        index={index + 1}
                        onPlay={(songItem, songIndex) => handlePlay(songItem, index)}
                        isPlaying={currentSong?.id === song.id && isPlaying}
                        onLike={handleLike}
                        isLiked={isLiked(song.id)}
                        showPlayedAt={true}
                        playedAt={song.playedAt}
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
                <div className="text-6xl mb-4">🎵</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No recently played songs</h2>
                <p className="text-gray-500 mb-6">Start listening to music to see your recent tracks here</p>
                <a 
                  href="/"
                  className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  <span className="mr-2">🏠</span>
                  Explore Music
                </a>
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
