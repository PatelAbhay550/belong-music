import { useState, useEffect, useCallback } from 'react';

export const useLikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load liked songs from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('likedSongs');
        if (saved && saved !== 'null' && saved !== 'undefined') {
          const parsedSongs = JSON.parse(saved);
          if (Array.isArray(parsedSongs)) {
            setLikedSongs(parsedSongs);
          } else {
            localStorage.removeItem('likedSongs');
            setLikedSongs([]);
          }
        } else {
          setLikedSongs([]);
        }
      } catch (error) {
        console.error('Error loading liked songs:', error);
        localStorage.removeItem('likedSongs');
        setLikedSongs([]);
      }
      setIsLoaded(true);
    }
  }, []);

  // Save liked songs to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (typeof window !== 'undefined' && isLoaded) {
      try {
        localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, [likedSongs, isLoaded]);

  // Check if a song is liked
  const isLiked = useCallback((songId) => {
    if (!songId) return false;
    return likedSongs.some(song => song.id === songId);
  }, [likedSongs]);

  // Add a song to liked songs
  const addLikedSong = useCallback((song) => {
    // Validate song object
    if (!song || !song.id) {
      console.error('Invalid song object - missing ID:', song);
      return false;
    }
    
    if (!isLiked(song.id)) {
      const likedSong = {
        id: song.id,
        name: song.name || song.title || 'Unknown Song',
        artists: song.artists || { primary: [{ name: 'Unknown Artist' }] },
        image: song.image || [],
        album: song.album || { name: 'Unknown Album' },
        duration: song.duration || 0,
        year: song.year || new Date().getFullYear(),
        language: song.language || 'unknown',
        downloadUrl: song.downloadUrl || null,
        likedAt: new Date().toISOString()
      };
      
      setLikedSongs(prev => [...prev, likedSong]);
      return true; // Song was added
    }
    return false; // Song was already liked
  }, [isLiked]);

  // Remove a song from liked songs
  const removeLikedSong = useCallback((songId) => {
    const wasLiked = isLiked(songId);
    setLikedSongs(prev => prev.filter(song => song.id !== songId));
    return wasLiked; // Return true if song was actually removed
  }, [isLiked]);

  // Toggle like status of a song
  const toggleLike = useCallback((song) => {
    if (isLiked(song.id)) {
      removeLikedSong(song.id);
      return false; // Now unliked
    } else {
      const success = addLikedSong(song);
      return true; // Now liked
    }
  }, [isLiked, addLikedSong, removeLikedSong]);

  // Get all liked songs
  const getAllLikedSongs = useCallback(() => {
    return likedSongs;
  }, [likedSongs]);

  // Clear all liked songs
  const clearLikedSongs = useCallback(() => {
    setLikedSongs([]);
  }, []);

  return {
    likedSongs,
    isLiked,
    addLikedSong,
    removeLikedSong,
    toggleLike,
    getAllLikedSongs,
    clearLikedSongs
  };
};
