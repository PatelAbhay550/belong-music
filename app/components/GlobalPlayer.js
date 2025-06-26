"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../contexts/AudioContext';
import { useLikedSongs } from '../hooks/useLikedSongs';

export default function GlobalPlayer() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    showNowPlaying,
    playSong,
    pauseSong,
    resumeSong,
    seekTo,
    playNext,
    playPrevious,
    toggleMute,
    changeVolume,
    toggleNowPlaying,
    setShowNowPlaying
  } = useAudio();
  
  const { isLiked, toggleLike } = useLikedSongs();
  const [isDragging, setIsDragging] = useState(false);

  // Don't render if no current song
  if (!currentSong) return null;

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * duration;
    seekTo(time);
  };

  const handleVolumeChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    changeVolume(percent);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      resumeSong();
    }
  };

  const handleLike = () => {
    if (currentSong) {
      toggleLike(currentSong);
    }
  };

  const handleDownload = () => {
    if (currentSong?.downloadUrl?.[4]?.url) {
      const link = document.createElement("a");
      link.href = currentSong.downloadUrl[4].url;
      link.download = `${currentSong.name} - 320kbps.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      {/* Mini Player Bar - Always visible when song is playing */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg z-40"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Song Info */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={currentSong.image?.[1]?.url || currentSong.image?.[0]?.url || "/LOGO.svg"}
                alt={currentSong.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentSong.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentSong.artists?.primary?.map(artist => artist.name).join(', ')}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`p-2 rounded-full transition-colors ${
                isLiked(currentSong.id)
                  ? 'text-red-500 hover:bg-red-50'
                  : 'text-gray-400 hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4" fill={isLiked(currentSong.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Previous */}
            <button
              onClick={playPrevious}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
              </svg>
            </button>

            {/* Play/Pause */}
            <button
              onClick={handlePlayPause}
              disabled={isLoading}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {/* Next */}
            <button
              onClick={playNext}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
              </svg>
            </button>

            {/* Expand Button */}
            <button
              onClick={toggleNowPlaying}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2">
          <div 
            className="w-full h-1 bg-gray-200 rounded-full cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-100"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </motion.div>

      {/* Now Playing Modal */}
      <AnimatePresence>
        {showNowPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowNowPlaying(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Now Playing</h3>
                <button
                  onClick={() => setShowNowPlaying(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Album Art */}
              <div className="w-full aspect-square rounded-lg overflow-hidden mb-6">
                <Image
                  src={currentSong.image?.[2]?.url || currentSong.image?.[1]?.url || "/LOGO.svg"}
                  alt={currentSong.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Song Info */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {currentSong.name}
                </h2>
                <p className="text-gray-600">
                  {currentSong.artists?.primary?.map(artist => artist.name).join(', ')}
                </p>
                {currentSong.album?.name && (
                  <p className="text-sm text-gray-500 mt-1">
                    {currentSong.album.name}
                  </p>
                )}
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div 
                  className="w-full h-2 bg-gray-200 rounded-full cursor-pointer"
                  onClick={handleProgressClick}
                >
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-6 mb-6">
                <button
                  onClick={playPrevious}
                  className="p-3 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                  </svg>
                </button>

                <button
                  onClick={handlePlayPause}
                  disabled={isLoading}
                  className="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={playNext}
                  className="p-3 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
                  </svg>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`p-2 rounded-full transition-colors ${
                    isLiked(currentSong.id)
                      ? 'text-red-500 bg-red-50'
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill={isLiked(currentSong.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                <button
                  onClick={handleDownload}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>

                {/* Volume Control */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleMute}
                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      {isMuted || volume === 0 ? (
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.764L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.797-3.764a1 1 0 011.617.764zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.764L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.797-3.764a1 1 0 011.617.764zM12 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm4-1a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1z" clipRule="evenodd" />
                      )}
                    </svg>
                  </button>
                  <div 
                    className="w-16 h-1 bg-gray-200 rounded-full cursor-pointer"
                    onClick={handleVolumeChange}
                  >
                    <div 
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
