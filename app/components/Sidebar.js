import { FiHome, FiSearch, FiHeart, FiPlus, FiDownload } from "react-icons/fi";

export default function Sidebar() {
  const playlists = [
    "Liked Songs",
    "Recently Played",
    "Made For You",
    "Discover Weekly",
    "Release Radar",
    "Chill Hits",
    "Top Songs 2024",
    "My Playlist #1",
    "Workout Mix",
    "Study Music"
  ];

  return (
    <aside className="w-64 bg-black text-white h-screen flex flex-col">
      {/* Main Navigation */}
      <div className="p-6">
        <nav className="space-y-4">
          <a href="#" className="flex items-center space-x-3 text-white hover:text-gray-300 transition-colors">
            <FiHome className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
            <FiSearch className="w-5 h-5" />
            <span>Search</span>
          </a>
        </nav>
      </div>

      {/* Library Section */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Your Library</h3>
          <button className="text-gray-400 hover:text-white transition-colors">
            <FiPlus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-2">
          <a href="#" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors py-1">
            <FiHeart className="w-5 h-5" />
            <span>Liked Songs</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors py-1">
            <FiDownload className="w-5 h-5" />
            <span>Downloaded Music</span>
          </a>
        </div>
      </div>

      {/* Playlists */}
      <div className="flex-1 px-6 overflow-y-auto">
        <div className="border-t border-gray-800 pt-4">
          <div className="space-y-2">
            {playlists.map((playlist, index) => (
              <a
                key={index}
                href="#"
                className="block text-gray-400 hover:text-white transition-colors py-1 text-sm truncate"
              >
                {playlist}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Install App */}
      <div className="p-6 border-t border-gray-800">
        <a href="#" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
          <FiDownload className="w-4 h-4" />
          <span className="text-sm">Install App</span>
        </a>
      </div>
    </aside>
  );
}
