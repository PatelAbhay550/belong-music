"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ArtistCard({ artist, onClick }) {
  return (
    <motion.div
      initial={{ y: -50, scale: 0.8, opacity: 0 }}
      whileInView={{ y: 0, scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="flex-shrink-0 w-40 cursor-pointer group"
    >
      <div className="relative">
        <Image
          className="w-full h-40 rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={artist?.image[2]?.url || "/public/noimg.png"}
          alt={artist.name}
          width={160}
          height={160}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all duration-300 flex items-center justify-center">
          <svg 
            className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <h3 className="text-center mt-3 text-sm font-medium text-white group-hover:text-green-400 transition-colors">
        {artist.name}
      </h3>
    </motion.div>
  );
}
