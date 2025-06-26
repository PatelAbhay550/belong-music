"use client";

import { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNowPlaying, setShowNowPlaying] = useState(false);
  
  const audioRef = useRef(null);

  // Load persisted state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const persistedState = localStorage.getItem('globalAudioState');
        if (persistedState) {
          const state = JSON.parse(persistedState);
          if (state.currentSong) {
            setCurrentSong(state.currentSong);
            setQueue(state.queue || [state.currentSong]);
            setCurrentIndex(state.currentIndex || 0);
            setVolume(state.volume || 1);
            setIsMuted(state.isMuted || false);
          }
        }
      } catch (error) {
        console.error('Error loading persisted audio state:', error);
      }
    }
  }, []);

  // Persist state to localStorage and cache audio for offline
  useEffect(() => {
    if (typeof window !== 'undefined' && currentSong) {
      try {
        const stateToSave = {
          currentSong,
          queue,
          currentIndex,
          volume,
          isMuted,
          currentTime
        };
        localStorage.setItem('globalAudioState', JSON.stringify(stateToSave));
        
        // Cache current song for offline playback
        if (currentSong && 'caches' in window) {
          cacheCurrentSong(currentSong);
        }
      } catch (error) {
        console.error('Error persisting audio state:', error);
      }
    }
  }, [currentSong, queue, currentIndex, volume, isMuted, currentTime]);

  // Cache song for offline playback
  const cacheCurrentSong = async (song) => {
    try {
      if (!song.downloadUrl) return;
      
      const cache = await caches.open('belong-music-audio-v1');
      const audioUrl = song.downloadUrl[4]?.url || song.downloadUrl[3]?.url || song.downloadUrl[2]?.url;
      
      if (audioUrl) {
        // Check if already cached
        const cachedResponse = await cache.match(audioUrl);
        if (!cachedResponse) {
          await cache.add(audioUrl);
          console.log('Cached song for offline:', song.name);
        }
      }
    } catch (error) {
      console.log('Failed to cache song:', error);
    }
  };

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.preload = 'none';
      
      // Enable background audio playback
      audioRef.current.setAttribute('playsinline', '');
      audioRef.current.setAttribute('webkit-playsinline', '');
      
      // Audio event listeners
      const audio = audioRef.current;
      
      const handleLoadStart = () => setIsLoading(true);
      const handleCanPlay = () => setIsLoading(false);
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        setIsLoading(false);
      };
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleEnded = () => {
        setIsPlaying(false);
        playNext();
      };
      const handleError = (e) => {
        console.error('Audio error:', e);
        setIsLoading(false);
        setIsPlaying(false);
      };
      const handlePause = () => {
        console.log('Audio paused by browser');
        // Don't automatically set isPlaying to false on pause
        // as this might be triggered by browser navigation
        // setIsPlaying(false);
      };
      const handlePlay = () => {
        console.log('Audio playing');
        setIsPlaying(true);
      };

      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('play', handlePlay);

      return () => {
        audio.removeEventListener('loadstart', handleLoadStart);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('play', handlePlay);
      };
    }
  }, []);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const playSong = async (song, songQueue = [], startIndex = 0) => {
    if (!song || !audioRef.current) return;

    try {
      setIsLoading(true);
      
      // If it's the same song, just toggle play/pause
      if (currentSong?.id === song.id) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
        }
        setIsLoading(false);
        return;
      }

      // Set new song and queue
      setCurrentSong(song);
      setQueue(songQueue.length > 0 ? songQueue : [song]);
      setCurrentIndex(startIndex);
      
      // Get audio URL (try different quality levels)
      let audioUrl = null;
      if (song.downloadUrl) {
        // Try different quality levels
        const qualityLevels = [4, 3, 2, 1, 0]; // 320kbps to 96kbps
        for (const level of qualityLevels) {
          if (song.downloadUrl[level]?.url) {
            audioUrl = song.downloadUrl[level].url;
            break;
          }
        }
      }

      if (!audioUrl) {
        throw new Error('No audio URL available');
      }

      // Load and play new song
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      
      await audioRef.current.play();
      setIsPlaying(true);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error playing song:', error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeSong = async () => {
    if (audioRef.current && currentSong) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error resuming song:', error);
      }
    }
  };

  // Auto-resume playback after navigation
  useEffect(() => {
    if (currentSong && audioRef.current && !isPlaying && !isLoading) {
      const attemptResume = async () => {
        try {
          if (audioRef.current.paused && audioRef.current.src) {
            await audioRef.current.play();
            setIsPlaying(true);
          }
        } catch (error) {
          console.log('Auto-resume failed:', error);
        }
      };
      
      // Delay auto-resume to allow for page transitions
      const timer = setTimeout(attemptResume, 100);
      return () => clearTimeout(timer);
    }
  }, [currentSong, isLoading]);

  const seekTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const playNext = () => {
    if (queue.length > 0 && currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextSong = queue[nextIndex];
      setCurrentIndex(nextIndex);
      playSong(nextSong, queue, nextIndex);
    }
  };

  const playPrevious = () => {
    if (queue.length > 0 && currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const prevSong = queue[prevIndex];
      setCurrentIndex(prevIndex);
      playSong(prevSong, queue, prevIndex);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const changeVolume = (newVolume) => {
    setVolume(Math.max(0, Math.min(1, newVolume)));
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const addToQueue = (songs) => {
    setQueue(prev => [...prev, ...songs]);
  };

  const removeFromQueue = (index) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
    if (index < currentIndex) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const clearQueue = () => {
    setQueue([]);
    setCurrentIndex(0);
  };

  const toggleNowPlaying = () => {
    setShowNowPlaying(!showNowPlaying);
  };

  const value = {
    // State
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    queue,
    currentIndex,
    showNowPlaying,
    
    // Actions
    playSong,
    pauseSong,
    resumeSong,
    seekTo,
    playNext,
    playPrevious,
    toggleMute,
    changeVolume,
    addToQueue,
    removeFromQueue,
    clearQueue,
    toggleNowPlaying,
    setShowNowPlaying
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};
