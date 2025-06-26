"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="flex items-center">
        <div 
          className={`flex items-center bg-gray-800 rounded-full transition-all duration-300 ${
            isExpanded ? 'w-80' : 'w-10'
          } h-10`}
        >
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          {isExpanded && (
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to listen to?"
              className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none px-2"
              autoFocus
            />
          )}
        </div>
      </form>
    </div>
  );
}
