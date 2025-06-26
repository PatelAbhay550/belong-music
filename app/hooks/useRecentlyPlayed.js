import { useState, useEffect, useCallback } from 'react';

export const useRecentlyPlayed = () => {
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load recently played songs from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('recentlyPlayed');
        if (saved && saved !== 'null' && saved !== 'undefined') {
          const parsedSongs = JSON.parse(saved);
          if (Array.isArray(parsedSongs)) {
            setRecentlyPlayed(parsedSongs);
          } else {
            localStorage.removeItem('recentlyPlayed');
            setRecentlyPlayed([]);
          }
        } else {
          setRecentlyPlayed([]);
        }
      } catch (error) {
        console.error('Error loading recently played songs:', error);
        localStorage.removeItem('recentlyPlayed');
        setRecentlyPlayed([]);
      }
      setIsLoaded(true);
    }
  }, []);

  // Save recently played songs to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (typeof window !== 'undefined' && isLoaded) {
      try {
        localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
      } catch (error) {
        console.error('Error saving recently played to localStorage:', error);
      }
    }
  }, [recentlyPlayed, isLoaded]);

  // Add a song to recently played
  const addToRecentlyPlayed = useCallback((song) => {
    if (!song || !song.id) {
      console.error('Invalid song object - missing ID:', song);
      return false;
    }

    const recentSong = {
      id: song.id,
      name: song.name || song.title || 'Unknown Song',
      artists: song.artists || { primary: [{ name: 'Unknown Artist' }] },
      image: song.image || [],
      album: song.album || { name: 'Unknown Album' },
      duration: song.duration || 0,
      year: song.year || new Date().getFullYear(),
      language: song.language || 'unknown',
      downloadUrl: song.downloadUrl || null,
      playedAt: new Date().toISOString()
    };

    setRecentlyPlayed(prev => {
      // Remove existing instance if present
      const filtered = prev.filter(item => item.id !== song.id);
      // Add to beginning (most recent first) and limit to 50 songs
      return [recentSong, ...filtered].slice(0, 50);
    });

    return true;
  }, []);

  // Get all recently played songs
  const getAllRecentlyPlayed = useCallback(() => {
    return recentlyPlayed;
  }, [recentlyPlayed]);

  // Clear recently played songs
  const clearRecentlyPlayed = useCallback(() => {
    setRecentlyPlayed([]);
  }, []);

  return {
    recentlyPlayed,
    addToRecentlyPlayed,
    getAllRecentlyPlayed,
    clearRecentlyPlayed
  };
};
