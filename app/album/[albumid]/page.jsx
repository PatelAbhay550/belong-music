"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import NotionHeader from "../../components/NotionHeader";
import NotionSidebar from "../../components/NotionSidebar";
import NotionPlayerBar from "../../components/NotionPlayerBar";
import Loading from "../../components/Loading";

const AlbumDetails = () => {
  const { albumid } = useParams();
  const router = useRouter();
  
  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get album details
  const getAlbum = async () => {
    try {
      const { data } = await axios.get(
        `https://jiosavan-api-with-playlist.vercel.app/api/albums/${albumid}`
      );
      setAlbum(data?.data);
      setSongs(data?.data?.songs || []);
    } catch (error) {
      console.log("Error fetching album:", error);
      toast.error("Failed to load album details");
    }
  };

  useEffect(() => {
    if (albumid) {
      setLoading(true);
      getAlbum().finally(() => {
        setLoading(false);
      });
    }
  }, [albumid]);

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

  if (!album) {
    return (
      <div className="flex h-screen bg-white">
        <NotionSidebar />
        <div className="flex-1 flex flex-col">
          <NotionHeader />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-gray-600">Album not found</p>
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
            
            {/* Album Header */}
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

              {/* Album Details Card */}
              <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Album Art */}
                  <div className="flex-shrink-0">
                    <div className="w-64 h-64 rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={album.image?.[2]?.url || album.image?.[1]?.url || album.image?.[0]?.url || "/LOGO.svg"}
                        alt={album.name || "Album"}
                        width={256}
                        height={256}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Album Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          ALBUM
                        </span>
                      </div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {album.name}
                      </h1>
                      <p className="text-lg text-gray-600">
                        by {album.artists?.primary?.map(artist => artist.name).join(", ")}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {songs.length} songs
                      </span>
                      {album.language && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {album.language}
                        </span>
                      )}
                      {album.year && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                          {album.year}
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
                        <span>Save</span>
                      </button>

                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        <span>Share</span>
                      </button>
                    </div>

                    {/* Album Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
                      <div>
                        <p className="text-sm text-gray-500">Songs</p>
                        <p className="font-medium">{songs.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">
                          {Math.floor(songs.reduce((acc, song) => acc + (song.duration || 0), 0) / 60)} min
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Year</p>
                        <p className="font-medium">{album.year || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Label</p>
                        <p className="font-medium">{album.label || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Songs List */}
            {songs.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-12"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Tracks</h2>
                
                {/* Songs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {songs.map((song, index) => (
                    <div
                      key={song.id || index}
                      className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => router.push(`/${song.id}`)}
                    >
                      <div className="flex items-center space-x-3">
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
                          <p className="text-xs text-gray-400">
                            {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlay(song, index);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-full transition-all"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
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
            isLiked={false}
            onLike={() => {}}
            onDownload={() => {}}
          />
        )}
      </div>
    </div>
  );
};

export default AlbumDetails;
