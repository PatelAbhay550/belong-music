"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function NotionPlayerBar({ song, isLiked, onLike, onDownload }) {
  const [isMinimized, setIsMinimized] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', () => setIsPlaying(false));
      
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', () => setIsPlaying(false));
      };
    }
  }, [song]);

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
    if (audio) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audio.currentTime = percent * duration;
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!song) {
    return null;
  }

  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={song.downloadUrl?.[4]?.url || song.downloadUrl?.[3]?.url || song.downloadUrl?.[2]?.url}
        preload="metadata"
      />
      
      <div className={`fixed bottom-0 right-0 bg-white border border-gray-200 rounded-t-lg shadow-lg transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-80'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <span className="text-lg">🎵</span>
            <span className="font-medium text-gray-900">Now Playing</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <svg 
                className={`w-4 h-4 text-gray-600 transition-transform ${isMinimized ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Minimized View */}
        {isMinimized && (
          <div className="flex items-center p-4 space-x-3">
            <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
              <Image
                src={song.image?.[0]?.url || "/LOGO.svg"}
                alt={song.name}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate text-sm">{song.name}</p>
              <p className="text-xs text-gray-500 truncate">
                {song.artists?.primary?.[0]?.name || 'Unknown Artist'}
              </p>
            </div>
            <button
              onClick={togglePlay}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isPlaying ? (
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Expanded View */}
        {!isMinimized && (
          <div className="p-4">
            <div className="text-center mb-4">
              <div className="w-24 h-24 rounded-lg mx-auto mb-3 overflow-hidden">
                <Image
                  src={song.image?.[1]?.url || song.image?.[0]?.url || "/LOGO.svg"}
                  alt={song.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium text-gray-900 truncate">{song.name}</h3>
              <p className="text-sm text-gray-500 truncate">
                {song.artists?.primary?.[0]?.name || 'Unknown Artist'}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                </svg>
              </button>
              <button 
                onClick={togglePlay}
                className="p-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div 
                className="w-full bg-gray-200 rounded-full h-1 cursor-pointer"
                onClick={handleSeek}
              >
                <div 
                  className="bg-gray-900 h-1 rounded-full transition-all" 
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Additional Controls */}
            <div className="flex items-center justify-center space-x-4 mt-4">
              {onLike && (
                <button
                  onClick={onLike}
                  className={`p-2 rounded-full transition-colors ${
                    isLiked 
                      ? 'text-red-600 hover:bg-red-50' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              )}
              {onDownload && (
                <button
                  onClick={onDownload}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
