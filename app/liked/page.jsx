"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import NotionHeader from "../components/NotionHeader";
import NotionSidebar from "../components/NotionSidebar";
import NotionMusicCard from "../components/NotionMusicCard";
import NotionPlayerBar from "../components/NotionPlayerBar";
import { useLikedSongs } from "../hooks/useLikedSongs";
import { useState } from "react";

export default function LikedSongs() {
  const router = useRouter();
  const { likedSongs, clearLikedSongs, toggleLike, isLiked } = useLikedSongs();
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClearAll = () => {
    if (confirm("Are you sure you want to remove all liked songs?")) {
      clearLikedSongs();
    }
  };

  // Play functionality
  const handlePlay = (song, index) => {
    setCurrentSong(song);
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const handlePlayAll = () => {
    if (likedSongs.length > 0) {
      setCurrentSong(likedSongs[0]);
      setCurrentIndex(0);
      setIsPlaying(true);
    }
  };

  // Like functionality
  const handleLike = (song) => {
    const newLikeStatus = toggleLike(song);
    toast.success(newLikeStatus ? "Added to favorites" : "Removed from favorites");
  };

  return (
    <div className="flex h-screen bg-white">
      <Toaster position="top-right" />
      <NotionSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden md:ml-0 ml-0">
        <NotionHeader />
        
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-8">
            
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Liked Songs</h1>
                  <p className="text-gray-600">
                    {likedSongs.length} {likedSongs.length === 1 ? 'song' : 'songs'} in your collection
                  </p>
                </div>
                
                {likedSongs.length > 0 && (
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={handlePlayAll}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      <span>Play All</span>
                    </button>
                    
                    <button 
                      onClick={handleClearAll}
                      className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Clear All</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Content */}
            {likedSongs.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="mb-6">
                  <svg className="w-24 h-24 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">No liked songs yet</h2>
                <p className="text-gray-600 mb-6">Start exploring music and like your favorite songs to see them here.</p>
                <button 
                  onClick={() => router.push('/')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Discover Music
                </button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {likedSongs.map((song, index) => (
                  <motion.div
                    key={song.id}
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
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
            
          </div>
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
    </div>
  );
}
