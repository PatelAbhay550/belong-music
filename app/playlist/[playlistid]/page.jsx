"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import NotionHeader from "../../components/NotionHeader";
import NotionSidebar from "../../components/NotionSidebar";
import NotionSection from "../../components/NotionSection";
import NotionMusicCard from "../../components/NotionMusicCard";
import NotionPlayerBar from "../../components/NotionPlayerBar";
import Loading from "../../components/Loading";
import { useLikedSongs } from "../../hooks/useLikedSongs";

const PlaylistDetails = () => {
  const { playlistid } = useParams();
  const router = useRouter();
  const { isLiked, toggleLike } = useLikedSongs();
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [songs, setSongs] = useState([]);

  // Convert playlistid to search query (decode URL if needed)
  const getSearchQuery = () => {
    // Convert kebab-case back to readable query
    const decoded = decodeURIComponent(playlistid);
    return decoded.replace(/-/g, ' ').replace(/[^a-z0-9\s]/gi, '').trim();
  };

  // Get playlists by search query
  const getPlaylists = async () => {
    try {
      const query = getSearchQuery();
      const { data } = await axios.get(
        `https://jiosavan-api-with-playlist.vercel.app/api/search/playlists?query=${query}&page=1&limit=10`
      );
      const playlistResults = data?.data?.results || [];
      setPlaylists(playlistResults);
      
      // Select the first playlist as the main one
      if (playlistResults.length > 0) {
        setSelectedPlaylist(playlistResults[0]);
        
        // Try to get songs from the first playlist
        if (playlistResults[0].id) {
          await getPlaylistSongs(playlistResults[0].id);
        }
      }
    } catch (error) {
      console.log("Error fetching playlists:", error);
      toast.error("Failed to load playlists");
    }
  };

  // Get songs from a specific playlist
  const getPlaylistSongs = async (playlistId) => {
    try {
      const { data } = await axios.get(
        `https://jiosavan-api-with-playlist.vercel.app/api/playlists/${playlistId}`
      );
      setSongs(data?.data?.songs || []);
    } catch (error) {
      console.log("Error fetching playlist songs:", error);
      // If we can't get songs from playlist, fallback to search songs
      await getSongsByQuery();
    }
  };

  // Fallback: Get songs by search query
  const getSongsByQuery = async () => {
    try {
      const query = getSearchQuery();
      const { data } = await axios.get(
        `https://jiosavan-api-with-playlist.vercel.app/api/search/songs?query=${query}&page=1&limit=20`
      );
      setSongs(data?.data?.results || []);
    } catch (error) {
      console.log("Error fetching songs:", error);
    }
  };

  useEffect(() => {
    if (playlistid) {
      setLoading(true);
      getPlaylists().finally(() => {
        setLoading(false);
      });
    }
  }, [playlistid]);

  // Play functionality
  const handlePlay = (song, index) => {
    setCurrentSong(song);
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const handlePlayAll = () => {
    if (songs.length > 0) {
      setCurrentSong(songs[0]);
      setCurrentIndex(0);
      setIsPlaying(true);
    }
  };

  // Like functionality
  const handleLike = (song) => {
    const newLikeStatus = toggleLike(song);
    toast.success(newLikeStatus ? "Added to favorites" : "Removed from favorites");
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-white">
        <NotionSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loading />
        </div>
      </div>
    );
  }

  if (!selectedPlaylist) {
    return (
      <div className="flex h-screen bg-white">
        <NotionSidebar />
        <div className="flex-1 flex flex-col">
          <NotionHeader />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-gray-600">No playlists found for "{getSearchQuery()}"</p>
              <button 
                onClick={() => router.push('/')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <Toaster position="top-right" />
      <NotionSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <NotionHeader />
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-8">
            
            {/* Playlist Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              {/* Back Button */}
              <button
                onClick={() => router.back()}
                className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm">Back to music</span>
              </button>

              {/* Playlist Details Card */}
              <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Playlist Art */}
                  <div className="flex-shrink-0">
                    <div className="w-64 h-64 rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={selectedPlaylist.image?.[2]?.url || selectedPlaylist.image?.[1]?.url || selectedPlaylist.image?.[0]?.url || "/LOGO.svg"}
                        alt={selectedPlaylist.name || "Playlist"}
                        width={256}
                        height={256}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Playlist Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          PLAYLIST
                        </span>
                      </div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {selectedPlaylist.name || `${getSearchQuery().charAt(0).toUpperCase() + getSearchQuery().slice(1)} Playlists`}
                      </h1>
                      {selectedPlaylist.description && (
                        <p className="text-lg text-gray-600 mb-4">
                          {selectedPlaylist.description}
                        </p>
                      )}
                      {!selectedPlaylist.description && (
                        <p className="text-lg text-gray-600 mb-4">
                          Discover amazing {getSearchQuery()} music and playlists
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {selectedPlaylist.songs?.length || 0} songs
                      </span>
                      {selectedPlaylist.followerCount && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {selectedPlaylist.followerCount.toLocaleString()} followers
                        </span>
                      )}
                      {selectedPlaylist.language && (
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                          {selectedPlaylist.language}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-4 pt-4">
                      <button
                        onClick={handlePlayAll}
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-white font-medium"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        <span>Play All</span>
                      </button>

                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>Like Playlist</span>
                      </button>

                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        <span>Share</span>
                      </button>
                    </div>

                    {/* Playlist Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                      <div>
                        <p className="text-sm text-gray-500">Songs</p>
                        <p className="font-medium">{selectedPlaylist.songCount || 0}</p>
                      </div>
                      {selectedPlaylist.followerCount && (
                        <div>
                          <p className="text-sm text-gray-500">Followers</p>
                          <p className="font-medium">{selectedPlaylist.followerCount.toLocaleString()}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="font-medium">Playlist</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Related Playlists Section */}
            {playlists.length > 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="mb-12"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Related Playlists</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {playlists.slice(1, 5).map((playlist, index) => (
                    <motion.div
                      key={playlist.id || index}
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
              </motion.div>
            )}

            {/* Songs List */}
            {songs.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-12"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Songs</h2>
                
                {/* Songs Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="hidden md:grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-500 bg-gray-50 border-b border-gray-200">
                    <div className="col-span-1 text-center">#</div>
                    <div className="col-span-4">Title</div>
                    <div className="col-span-3">Album</div>
                    <div className="col-span-2">Duration</div>
                    <div className="col-span-2 text-center">Actions</div>
                  </div>
                  
                  {songs.map((song, index) => (
                    <div
                      key={song.id || index}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="hidden md:flex col-span-1 items-center justify-center text-sm text-gray-500">
                        {index + 1}
                      </div>
                      
                      <div className="col-span-1 md:col-span-4 flex items-center space-x-3">
                        <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={song.image?.[0]?.url || "/LOGO.svg"}
                            alt={song.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{song.name}</p>
                          <p className="text-sm text-gray-500 truncate">
                            {song.artists?.primary?.[0]?.name || 'Unknown Artist'}
                          </p>
                        </div>
                        <button
                          onClick={() => handlePlay(song, index)}
                          className="md:hidden p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="hidden md:flex col-span-3 items-center">
                        <p className="text-sm text-gray-500 truncate">
                          {song.album?.name || 'Unknown Album'}
                        </p>
                      </div>
                      
                      <div className="hidden md:flex col-span-2 items-center">
                        <p className="text-sm text-gray-500">
                          {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                        </p>
                      </div>
                      
                      <div className="hidden md:flex col-span-2 items-center justify-center space-x-2">
                        <button
                          onClick={() => handlePlay(song, index)}
                          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                          title="Play song"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleLike(song)}
                          className={`p-2 rounded-full transition-colors ${
                            isLiked(song.id) 
                              ? 'text-red-600 hover:bg-red-50' 
                              : 'text-gray-600 hover:bg-gray-200'
                          }`}
                          title={isLiked(song.id) ? "Remove from favorites" : "Add to favorites"}
                        >
                          <svg className="w-4 h-4" fill={isLiked(song.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => router.push(`/${song.id}`)}
                          className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
                          title="View song details"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
};

export default PlaylistDetails;
