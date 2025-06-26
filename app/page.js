"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import NotionHeader from "./components/NotionHeader";
import NotionSidebar from "./components/NotionSidebar";
import NotionSection from "./components/NotionSection";
import NotionMusicCard from "./components/NotionMusicCard";
import NotionQuickAccessCard from "./components/NotionQuickAccessCard";
import NotionPlayerBar from "./components/NotionPlayerBar";
import LanguageSelector from "./components/LanguageSelector";
import StructuredData from "./components/StructuredData";
import { useLikedSongs } from "./hooks/useLikedSongs";
import { useRecentlyPlayed } from "./hooks/useRecentlyPlayed";

export default function Home() {
  const { isLiked, toggleLike, likedSongs } = useLikedSongs();
  const { addToRecentlyPlayed, recentlyPlayed } = useRecentlyPlayed();
  const [songs, setSongs] = useState(null);
  const [trendingSongs, setTrendingSongs] = useState(null);
  const [trendingPlaylists, setTrendingPlaylists] = useState(null);
  const [popularPlaylists, setPopularPlaylists] = useState(null);
  const [chillPlaylists, setChillPlaylists] = useState(null);
  const [workoutPlaylists, setWorkoutPlaylists] = useState(null);
  const [home, setHome] = useState(null);
  const [language, setLanguage] = useState("hindi");
  const [loading, setLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();

  // Function to fetch playlists with different queries
  const fetchPlaylistsByQuery = async (query, page = 1) => {
    try {
      const response = await fetch(`https://jiosavan-api-with-playlist.vercel.app/api/search/playlists?query=${query}&page=${page}&limit=10`);
      const data = await response.json();
      return data.data?.results || [];
    } catch (error) {
      console.error(`Error fetching ${query} playlists:`, error);
      return [];
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch home data (albums, playlists, charts)
        const homeRes = await fetch(`https://jiosaavan-harsh-patel.vercel.app/modules?language=${language}`);
        const homeData = await homeRes.json();
        setHome(homeData.data);

        // Fetch trending songs based on language
        const trendingRes = await fetch(`https://jiosavan-api-with-playlist.vercel.app/api/search/songs?query=${language}&page=1&limit=20`);
        const trendingData = await trendingRes.json();
        setTrendingSongs(trendingData.data?.results || []);

        // Fetch different types of playlists
        const [trending, popular, chill, workout] = await Promise.all([
          fetchPlaylistsByQuery('trending'),
          fetchPlaylistsByQuery('popular'),
          fetchPlaylistsByQuery('chill'),
          fetchPlaylistsByQuery('workout')
        ]);

        setTrendingPlaylists(trending);
        setPopularPlaylists(popular);
        setChillPlaylists(chill);
        setWorkoutPlaylists(workout);

        setSongs(homeData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [language]);

  // Play functionality
  const handlePlay = (song, index) => {
    setCurrentSong(song);
    setIsPlaying(true);
    addToRecentlyPlayed(song);
  };  // Like functionality
  const handleLike = (song) => {
    const newLikeStatus = toggleLike(song);
    toast.success(newLikeStatus ? "Added to favorites" : "Removed from favorites");
  };

  // Generate structured data for home page
  const generateHomeStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Belong Music",
      "description": "Discover, stream, and enjoy millions of songs from your favorite artists. Create playlists, explore trending music, and experience high-quality audio streaming.",
      "url": typeof window !== 'undefined' ? window.location.origin : 'https://belong-music.vercel.app',
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${typeof window !== 'undefined' ? window.location.origin : 'https://belong-music.vercel.app'}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Belong Music",
        "logo": {
          "@type": "ImageObject",
          "url": `${typeof window !== 'undefined' ? window.location.origin : 'https://belong-music.vercel.app'}/LOGO.svg`
        }
      }
    };
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getQuickAccessItems = () => [
    { 
      title: "Liked Songs", 
      icon: "❤️", 
      subtitle: `${likedSongs.length} favorite track${likedSongs.length !== 1 ? 's' : ''}`,
      color: "#ff6b6b",
      href: "/liked"
    },
    { 
      title: "Recently Played", 
      icon: "🕐", 
      subtitle: `${recentlyPlayed.length} recent track${recentlyPlayed.length !== 1 ? 's' : ''}`,
      color: "#4ecdc4",
      href: "/recently-played"
    },
    { 
      title: "Discover Weekly", 
      icon: "🔍", 
      subtitle: "New recommendations",
      color: "#45b7d1",
      href: "/discover"
    },
    { 
      title: "Release Radar", 
      icon: "📡", 
      subtitle: "Latest releases",
      color: "#f9ca24",
      onClick: () => {
        router.push('/search?q=new releases');
        toast.info('Searching for latest releases...');
      }
    },
    { 
      title: "Daily Mix 1", 
      icon: "🎧", 
      subtitle: "Your daily playlist",
      color: "#6c5ce7",
      onClick: () => {
        if (trendingSongs && trendingSongs.length > 0) {
          const randomSong = trendingSongs[Math.floor(Math.random() * trendingSongs.length)];
          handlePlay(randomSong, 0);
          toast.success('Playing from Daily Mix 1');
        } else {
          toast.error('Daily Mix not available right now');
        }
      }
    },
    { 
      title: "Chill Vibes", 
      icon: "🌙", 
      subtitle: "Relaxing music",
      color: "#fd79a8",
      href: "/chill"
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      <Toaster position="top-right" />
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Belong Music",
        "description": "Discover, stream, and enjoy millions of songs from your favorite artists. Create playlists, explore trending music, and experience high-quality audio streaming.",
        "url": typeof window !== 'undefined' ? window.location.origin : 'https://belong-music.vercel.app',
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${typeof window !== 'undefined' ? window.location.origin : 'https://belong-music.vercel.app'}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      }} />
      <NotionSidebar />
      
      <div className="flex-1 flex flex-col md:ml-0 ml-0">
        <NotionHeader />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🎵</span>
                  <h1 className="text-2xl font-bold text-gray-900">Music Dashboard</h1>
                </div>
                <LanguageSelector 
                  selectedLanguage={language} 
                  onLanguageChange={setLanguage} 
                />
              </div>
              <p className="text-gray-500 text-sm">{getCurrentDate()}</p>
            </motion.div>

            {/* Quick Access Section */}
            <NotionSection title="Quick Access" icon="⚡">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getQuickAccessItems().map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <NotionQuickAccessCard {...item} />
                  </motion.div>
                ))}
              </div>
            </NotionSection>

            {/* Trending Songs */}
            {trendingSongs && trendingSongs.length > 0 && (
              <NotionSection 
                title={`Trending ${language.charAt(0).toUpperCase() + language.slice(1)} Music`} 
                icon="📈"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {trendingSongs.slice(0, 8).map((song, index) => (
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
                </div>
              </NotionSection>
            )}

            {/* Charts */}
            {trendingPlaylists && trendingPlaylists.length > 0 && (
              <NotionSection title="Top Charts" icon="🏆">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {trendingPlaylists.slice(0, 8).map((playlist, index) => (
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

            {/* Albums */}
            {popularPlaylists && popularPlaylists.length > 0 && (
              <NotionSection title="Popular Albums" icon="💿">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {popularPlaylists.slice(0, 8).map((album, index) => (
                    <motion.div
                      key={album.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <NotionMusicCard 
                        item={album} 
                        type="playlist" 
                        index={index + 1}
                      />
                    </motion.div>
                  ))}
                </div>
              </NotionSection>
            )}

            {/* Chill Playlists */}
            {chillPlaylists && chillPlaylists.length > 0 && (
              <NotionSection title="Chill Vibes" icon="😌">
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

            {/* Workout Playlists */}
            {workoutPlaylists && workoutPlaylists.length > 0 && (
              <NotionSection title="Workout Energy" icon="�">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {workoutPlaylists.slice(0, 8).map((playlist, index) => (
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

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-16 pt-8 border-t border-gray-200"
            >
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">
                  <strong>Belong Music</strong> - Your personal music workspace
                </p>
                <p className="text-gray-400 text-xs">
                  Not affiliated with JioSaavn. All content belongs to respective owners. Educational use only.
                </p>
              </div>
            </motion.div>
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
