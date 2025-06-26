"use client";

import { Suspense, useEffect, useState } from "react";
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
import StructuredData from "../../components/StructuredData";
import { useLikedSongs } from "../../hooks/useLikedSongs";
import { useRecentlyPlayed } from "../../hooks/useRecentlyPlayed";
import { useAudio } from "../../contexts/AudioContext";

function ArtistContent() {
  const { id } = useParams();
  const router = useRouter();
  const { isLiked, toggleLike } = useLikedSongs();
  const { addToRecentlyPlayed } = useRecentlyPlayed();
  const { playSong, currentSong: globalCurrentSong, isPlaying: globalIsPlaying } = useAudio();
  
  const [artist, setArtist] = useState(null);
  const [topSongs, setTopSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('songs');

  // Get artist details
  const getArtist = async () => {
    try {
      const { data } = await axios.get(
        `https://jiosavan-api-with-playlist.vercel.app/api/artists/${id}`
      );
      
      if (data?.data) {
        setArtist(data.data);
        setTopSongs(data.data.topSongs || []);
        setAlbums(data.data.topAlbums || []);
      }
    } catch (error) {
      console.error("Error fetching artist:", error);
      toast.error("Failed to load artist details");
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      getArtist().finally(() => {
        setLoading(false);
      });
    }
  }, [id]);

  // Update document title and meta tags when artist data changes
  useEffect(() => {
    if (artist) {
      const title = `${artist.name} - Songs, Albums & Biography | Belong Music`;
      const description = `Listen to ${artist.name}'s top songs and albums on Belong Music. Discover ${artist.name}'s biography, latest releases, and popular tracks.`;
      
      document.title = title;
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = description;

      // Update Open Graph tags
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.content = title;

      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (!ogDescription) {
        ogDescription = document.createElement('meta');
        ogDescription.setAttribute('property', 'og:description');
        document.head.appendChild(ogDescription);
      }
      ogDescription.content = description;

      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.content = artist.image?.[2]?.url || artist.image?.[1]?.url || artist.image?.[0]?.url || '/LOGO.svg';
    }
  }, [artist]);

  // Play functionality
  const handlePlay = (song, index) => {
    playSong(song);
    addToRecentlyPlayed(song);
    setCurrentSong(song);
    setIsPlaying(true);
  };

  // Like functionality
  const handleLike = (song) => {
    const newLikeStatus = toggleLike(song);
    toast.success(newLikeStatus ? "Added to favorites" : "Removed from favorites");
  };

  // Generate structured data for SEO
  const generateStructuredData = (artist) => {
    return {
      "@context": "https://schema.org",
      "@type": "MusicGroup",
      "name": artist.name,
      "image": artist.image?.[2]?.url || artist.image?.[1]?.url || artist.image?.[0]?.url,
      "url": `${typeof window !== 'undefined' ? window.location.origin : ''}/artist/${artist.id}`,
      "description": artist.bio || `Listen to ${artist.name}'s top songs and albums on Belong Music.`,
      "genre": artist.dominantType || "Music",
      "sameAs": artist.urls?.map(url => url.url) || [],
      "album": albums.map(album => ({
        "@type": "MusicAlbum",
        "name": album.name,
        "url": `${typeof window !== 'undefined' ? window.location.origin : ''}/album/${album.id}`
      }))
    };
  };

  const tabs = [
    { id: 'songs', label: 'Top Songs', count: topSongs.length },
    { id: 'albums', label: 'Albums', count: albums.length },
    { id: 'about', label: 'About', count: '' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'songs':
        return topSongs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {topSongs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <NotionMusicCard 
                  item={song} 
                  type="song" 
                  index={index + 1}                        onPlay={(songItem, songIndex) => handlePlay(songItem, index)}
                        isPlaying={globalCurrentSong?.id === song.id && globalIsPlaying}
                  onLike={handleLike}
                  isLiked={isLiked(song.id)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No songs found for this artist</p>
          </div>
        );
      
      case 'albums':
        return albums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {albums.map((album, index) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <NotionMusicCard 
                  item={album} 
                  type="album" 
                  index={index + 1}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No albums found for this artist</p>
          </div>
        );
      
      case 'about':
        return (
          <div className="max-w-4xl">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About {artist?.name}</h3>
              
              {artist?.bio ? (
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed">{artist.bio}</p>
                </div>
              ) : (
                <p className="text-gray-500">No biography available for this artist.</p>
              )}
              
              {/* Artist Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Followers</p>
                  <p className="font-medium">{artist?.followerCount?.toLocaleString() || 'N/A'}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Top Songs</p>
                  <p className="font-medium">{topSongs.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Albums</p>
                  <p className="font-medium">{albums.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{artist?.dominantType || 'Artist'}</p>
                </div>
              </div>
              
              {/* Social Links */}
              {artist?.urls && artist.urls.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Links</h4>
                  <div className="flex flex-wrap gap-2">
                    {artist.urls.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                      >
                        🔗 {link.title || 'External Link'}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <NotionSidebar />
        <div className="flex-1 flex items-center justify-center md:ml-0 ml-0">
          <Loading />
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex min-h-screen bg-white">
        <NotionSidebar />
        <div className="flex-1 flex flex-col md:ml-0 ml-0">
          <NotionHeader />
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <p className="text-lg text-gray-600">Artist not found</p>
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
    <div className="flex min-h-screen bg-white">
      <Toaster position="top-right" />
      {artist && <StructuredData data={generateStructuredData(artist)} />}
      <NotionSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden md:ml-0 ml-0">
        <NotionHeader />
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-4 md:p-8">
            
            {/* Artist Header */}
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

              {/* Artist Details Card */}
              <div className="bg-gray-50 rounded-lg p-4 md:p-8 border border-gray-200">
                <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                  {/* Artist Image */}
                  <div className="flex-shrink-0 mx-auto lg:mx-0">
                    <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-lg">
                      <Image
                        src={artist.image?.[2]?.url || artist.image?.[1]?.url || "/LOGO.svg"}
                        alt={artist.name || "Artist"}
                        width={256}
                        height={256}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Artist Info */}
                  <div className="flex-1 space-y-4 text-center lg:text-left">
                    <div>
                      <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {artist.dominantType || 'Artist'}
                        </span>
                        {artist.isVerified && (
                          <span className="text-blue-500">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {artist.name}
                      </h1>
                      {artist.followerCount && (
                        <p className="text-base md:text-lg text-gray-600">
                          {artist.followerCount.toLocaleString()} followers
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                      <button
                        onClick={() => topSongs.length > 0 && handlePlay(topSongs[0], 0)}
                        disabled={topSongs.length === 0}
                        className="flex items-center justify-center space-x-2 px-6 py-3 rounded-md transition-colors text-white font-medium w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        <span>Play Top Songs</span>
                      </button>

                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors flex-1 sm:flex-none justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="hidden sm:inline">Follow</span>
                      </button>

                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors flex-1 sm:flex-none justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        <span className="hidden sm:inline">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content Tabs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 w-full md:w-fit overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                      activeTab === tab.id
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                    {tab.count > 0 && activeTab !== tab.id && (
                      <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ArtistPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-white">
        <NotionSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loading />
        </div>
      </div>
    }>
      <ArtistContent />
    </Suspense>
  );
}
