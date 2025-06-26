"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import LikeButton from "./LikeButton";
import DownloadButton from "./DownloadButton";

export default function AudioPlayer({ 
  song, 
  isLiked, 
  onLike, 
  onNext, 
  onPrevious, 
  onDownload 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showDownloads, setShowDownloads] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', onNext);
      
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', onNext);
      };
    }
  }, [song, onNext]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    if (audio) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const qualities = ['12kbps', '48kbps', '96kbps', '160kbps', '320kbps'];
  const descriptions = ['Very low quality', 'Low quality', 'Fair quality', 'Good quality', 'High quality'];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4"
    >
      <audio
        ref={audioRef}
        src={song?.downloadUrl?.[4]?.url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        autoPlay
      />
      
      <div className="max-w-screen-xl mx-auto">
        {/* Main Player */}
        <div className="flex items-center justify-between mb-2">
          {/* Song Info */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <Image
                className="w-14 h-14 rounded-lg object-cover"
                src={song?.image?.[2]?.url || "/placeholder.jpg"}
                alt={song?.name || "Song"}
                width={56}
                height={56}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-medium text-sm truncate">
                {song?.name}
              </h3>
              <p className="text-gray-400 text-xs truncate">
                {song?.album?.name}
              </p>
            </div>
            <LikeButton isLiked={isLiked} onClick={onLike} />
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4 mx-8">
            <button
              onClick={onPrevious}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
              </svg>
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            <button
              onClick={onNext}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
              </svg>
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-4">
            {/* Volume */}
            <div className="hidden md:flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.82L4.17 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.17l4.213-3.82a1 1 0 011.617.82zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 accent-green-500"
              />
            </div>

            {/* Download Toggle */}
            <button
              onClick={() => setShowDownloads(!showDownloads)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center space-x-3 text-xs text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <div
            className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-green-500 rounded-full relative"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            >
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Download Options */}
        {showDownloads && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-700"
          >
            <h4 className="text-sm font-medium text-white mb-3">Download Options</h4>
            <div className="flex flex-wrap gap-2">
              {song?.downloadUrl?.map((download, idx) => (
                <DownloadButton
                  key={idx}
                  quality={qualities[idx]}
                  description={descriptions[idx]}
                  onClick={() => onDownload(download.url, `${song.name} ${qualities[idx]}`)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
