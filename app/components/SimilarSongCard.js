"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function SimilarSongCard({ track, isActive, onClick }) {
  return (
    <motion.div
      initial={{ y: -50, scale: 0.8, opacity: 0 }}
      whileInView={{ y: 0, scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="relative flex-shrink-0 w-40 cursor-pointer group"
    >
      <div className="relative">
        <Image
          className="w-full h-40 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
          src={track.image[2].url}
          alt={track.name}
          width={160}
          height={160}
        />
        
        {/* Playing indicator */}
        {isActive && (
          <div className="absolute top-2 left-2">
            <div className="flex space-x-1">
              <div className="w-1 h-4 bg-green-500 animate-pulse"></div>
              <div className="w-1 h-6 bg-green-500 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-5 bg-green-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-7 bg-green-500 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>
        )}
        
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-300 flex items-center justify-center">
          <svg 
            className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      <div className="mt-3">
        <h3 className={`text-sm font-bold leading-tight truncate ${
          isActive ? 'text-green-400' : 'text-white group-hover:text-green-400'
        } transition-colors`}>
          {track.name}
        </h3>
        <p className="text-xs text-gray-400 truncate mt-1">
          {track.album.name}
        </p>
      </div>
    </motion.div>
  );
}
