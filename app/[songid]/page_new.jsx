"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import NotionHeader from "../components/NotionHeader";
import NotionSidebar from "../components/NotionSidebar";
import NotionSection from "../components/NotionSection";
import NotionMusicCard from "../components/NotionMusicCard";
import NotionPlayerBar from "../components/NotionPlayerBar";
import Loading from "../components/Loading";

const SongDetails = () => {
  const { songid } = useParams();
  const router = useRouter();
  
  const [song, setSong] = useState(null);
  const [similarSongs, setSimilarSongs] = useState([]);
  const [songlink, setSonglink] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get song details
  const getSong = async () => {
    try {
      const { data } = await axios.get(
        `https://jiosavan-api-with-playlist.vercel.app/api/songs/${songid}?lyrics=true`
      );
      setSong(data?.data?.[0]);
      
      // Set song link for audio player
      if (data?.data?.[0]?.downloadUrl) {
        setSonglink(data.data);
      }
    } catch (error) {
      console.log("Error fetching song:", error);
      toast.error("Failed to load song details");
    }
  };

  // Get similar songs
  const getSimilarSongs = async () => {
    try {
      const { data } = await axios.get(
        `https://jiosavan-api-with-playlist.vercel.app/api/songs/${songid}/suggestions?limit=20`
      );
      setSimilarSongs(data?.data || []);
    } catch (error) {
      console.log("Error fetching similar songs:", error);
    }
  };

  useEffect(() => {
    if (songid) {
      setLoading(true);
      Promise.all([getSong(), getSimilarSongs()]).finally(() => {
        setLoading(false);
      });
    }
  }, [songid]);

  // Like functionality
  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from favorites" : "Added to favorites");
  };

  // Download functionality
  const handleDownload = (url, quality = "320kbps") => {
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.download = `${song?.name} - ${quality}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started!");
    }
  };

  // Play similar song
  const playSimilarSong = (index) => {
    setCurrentIndex(index);
    const selectedSong = similarSongs[index];
    if (selectedSong?.id) {
      router.push(`/${selectedSong.id}`);
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

  if (!song) {
    return (
      <div className="flex h-screen bg-white">
        <NotionSidebar />
        <div className="flex-1 flex flex-col">
          <NotionHeader />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-gray-600">Song not found</p>
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
            
            {/* Song Header */}
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

              {/* Song Details Card */}
              <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Album Art */}
                  <div className="flex-shrink-0">
                    <div className="w-64 h-64 rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={song.image?.[2]?.url || "/LOGO.svg"}
                        alt={song.name || "Song"}
                        width={256}
                        height={256}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Song Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {song.name}
                      </h1>
                      <p className="text-lg text-gray-600">
                        by {song.artists?.primary?.map(artist => artist.name).join(", ")}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {song.album?.name && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {song.album.name}
                        </span>
                      )}
                      {song.language && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {song.language}
                        </span>
                      )}
                      {song.year && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                          {song.year}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-4 pt-4">
                      <button
                        onClick={handleLike}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                          isLiked 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{isLiked ? 'Liked' : 'Like'}</span>
                      </button>

                      {song.downloadUrl?.[4]?.url && (
                        <button
                          onClick={() => handleDownload(song.downloadUrl[4].url)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Download</span>
                        </button>
                      )}

                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        <span>Share</span>
                      </button>
                    </div>

                    {/* Song Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Plays</p>
                        <p className="font-medium">{song.playCount?.toLocaleString() || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Quality</p>
                        <p className="font-medium">320kbps</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Label</p>
                        <p className="font-medium">{song.label || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Artists Section */}
            {song.artists?.primary && song.artists.primary.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-12"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Artists</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {song.artists.primary.map((artist, index) => (
                    <div
                      key={index}
                      className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => router.push(`/artists/${artist.id}`)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          {artist.image?.[0]?.url ? (
                            <Image
                              src={artist.image[0].url}
                              alt={artist.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="text-gray-600 text-lg">🎤</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {artist.name}
                          </p>
                          <p className="text-sm text-gray-500">Artist</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Similar Songs Section */}
            {similarSongs.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <NotionSection
                  title="Similar Songs"
                  items={similarSongs}
                  type="songs"
                  onItemClick={(item, index) => playSimilarSong(index)}
                />
              </motion.div>
            )}

            {/* Lyrics Section */}
            {song.lyrics && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-12"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Lyrics</h2>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <pre className="whitespace-pre-wrap text-gray-700 font-mono text-sm leading-relaxed">
                    {song.lyrics}
                  </pre>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Audio Player */}
        {songlink.length > 0 && (
          <NotionPlayerBar 
            song={songlink[0]}
            isLiked={isLiked}
            onLike={handleLike}
            onDownload={() => handleDownload(song.downloadUrl?.[4]?.url)}
          />
        )}
      </div>
    </div>
  );
};

export default SongDetails;
