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

export default function ChillVibesPage() {
  const { isLiked, toggleLike } = useLikedSongs();
  const { addToRecentlyPlayed } = useRecentlyPlayed();
  const [chillSongs, setChillSongs] = useState([]);
  const [chillPlaylists, setChillPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchChillContent();
  }, []);

  const fetchChillContent = async () => {
    try {
      // Fetch chill playlists
      const playlistResponse = await fetch('https://jiosavan-api-with-playlist.vercel.app/api/search/playlists?query=chill&page=1&limit=12');
      const playlistData = await playlistResponse.json();
      
      if (playlistData.success && playlistData.data?.results) {
        setChillPlaylists(playlistData.data.results);
      }

      // Fetch some chill songs from trending
      const songsResponse = await fetch('https://jiosaavan-harsh-patel.vercel.app/modules?language=hindi');
      const songsData = await songsResponse.json();
      
      if (songsData.status === 'SUCCESS' && songsData.data?.trending?.songs) {
        // Filter songs that might be more chill (this is a simple approach)
        const allSongs = songsData.data.trending.songs;
        const chillKeywords = ['chill', 'relax', 'calm', 'peaceful', 'soft', 'slow'];
        
        const chillFilteredSongs = allSongs.filter(song => {
          const songName = (song.name || '').toLowerCase();
          const artistNames = song.artists?.primary?.map(a => a.name.toLowerCase()).join(' ') || '';
          const albumName = (song.album?.name || '').toLowerCase();
          
          return chillKeywords.some(keyword => 
            songName.includes(keyword) || 
            artistNames.includes(keyword) || 
            albumName.includes(keyword)
          );
        });

        // If not enough chill-filtered songs, take random songs
        const finalChillSongs = chillFilteredSongs.length >= 20 
          ? chillFilteredSongs.slice(0, 30)
          : [...chillFilteredSongs, ...allSongs.slice(0, 30 - chillFilteredSongs.length)];

        setChillSongs(finalChillSongs);
      }
    } catch (error) {
      console.error('Error fetching chill content:', error);
      toast.error('Failed to load chill vibes');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex">
        <NotionSidebar />
        <div className="flex-1 flex flex-col md:ml-0 ml-0">
          <NotionHeader />
          <main className="flex-1 overflow-y-auto flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm">Loading chill vibes...</p>
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
                <span className="text-2xl">🌙</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Chill Vibes</h1>
                  <p className="text-gray-500 text-sm">Relaxing music to unwind and destress</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{chillSongs.length} songs</span>
                <span>•</span>
                <span>{chillPlaylists.length} playlists</span>
                <span>•</span>
                <span>Perfect for relaxation</span>
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
                onClick={() => chillSongs.length > 0 && handlePlay(chillSongs[0], 0)}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                disabled={chillSongs.length === 0}
              >
                <span>▶️</span>
                <span>Play Chill Mix</span>
              </button>
              <button
                onClick={fetchChillContent}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <span>🔄</span>
                <span>Refresh</span>
              </button>
            </motion.div>

            {/* Chill Playlists */}
            {chillPlaylists.length > 0 && (
              <NotionSection title="Chill Playlists" icon="🎧">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {chillPlaylists.slice(0, 8).map((playlist, index) => (
                    <motion.div
                      key={playlist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <NotionMusicCard 
                        item={playlist} 
                        type="playlist" 
                        index={index + 1}
                      />
                    </motion.div>
                  ))}
                </div>
              </NotionSection>
            )}

            {/* Chill Songs */}
            {chillSongs.length > 0 && (
              <NotionSection title="Chill Songs" icon="🌸">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {chillSongs.slice(0, 16).map((song, index) => (
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
            )}

            {/* No content fallback */}
            {chillSongs.length === 0 && chillPlaylists.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">🌙</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load chill vibes</h2>
                <p className="text-gray-500 mb-6">Try refreshing to get your relaxing music</p>
                <button 
                  onClick={fetchChillContent}
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
