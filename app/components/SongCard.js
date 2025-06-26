"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiPlay, FiHeart, FiMoreHorizontal } from "react-icons/fi";

export default function SongCard({ song }) {
  const router = useRouter();

  const handleSongClick = () => {
    router.push(`/${song.id}`);
  };

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="group bg-gray-900 hover:bg-gray-800 rounded-lg p-4 transition-all duration-300 cursor-pointer"
      onClick={handleSongClick}
    >
      <div className="relative mb-4 overflow-hidden rounded-md">
        <img
          src={song.image?.[2]?.url || song.image?.[2]?.link}
          alt={song.name}
          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
          <button className="bg-green-500 hover:bg-green-400 text-black rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-xl">
            <FiPlay className="w-6 h-6 ml-1" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-white font-medium text-sm line-clamp-2 group-hover:underline">
          {song.name}
        </h3>
        <p className="text-gray-400 text-xs line-clamp-2">
          {song.artists?.primary?.[0]?.name || song.album?.name || "Unknown Artist"}
        </p>
        {song.duration && (
          <p className="text-gray-500 text-xs">
            {formatDuration(song.duration)}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          className="text-gray-400 hover:text-red-500 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Handle like functionality
          }}
        >
          <FiHeart className="w-4 h-4" />
        </button>
        <button 
          className="text-gray-400 hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Handle more options
          }}
        >
          <FiMoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
