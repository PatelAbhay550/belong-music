import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiShuffle, FiRepeat, FiVolume2, FiHeart, FiMaximize2 } from "react-icons/fi";
import { useState } from "react";

export default function PlayerBar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);
  const [volume, setVolume] = useState(75);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Currently Playing */}
        <div className="flex items-center space-x-3 min-w-0 w-1/4">
          <div className="w-14 h-14 bg-gray-800 rounded-md flex-shrink-0">
            <img
              src="https://via.placeholder.com/56x56/333/666?text=♪"
              alt="Current track"
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          <div className="min-w-0">
            <h4 className="text-white text-sm font-medium truncate">Song Title</h4>
            <p className="text-gray-400 text-xs truncate">Artist Name</p>
          </div>
          <button className="text-gray-400 hover:text-green-400 transition-colors">
            <FiHeart className="w-4 h-4" />
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center w-2/4 max-w-md">
          <div className="flex items-center space-x-4 mb-2">
            <button className="text-gray-400 hover:text-white transition-colors">
              <FiShuffle className="w-4 h-4" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <FiSkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-white hover:bg-gray-200 text-black rounded-full p-2 transition-colors"
            >
              {isPlaying ? (
                <FiPause className="w-5 h-5" />
              ) : (
                <FiPlay className="w-5 h-5 ml-0.5" />
              )}
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <FiSkipForward className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <FiRepeat className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-2 w-full">
            <span className="text-gray-400 text-xs">1:23</span>
            <div className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer group">
              <div 
                className="h-full bg-white rounded-full relative group-hover:bg-green-400 transition-colors"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
            <span className="text-gray-400 text-xs">3:45</span>
          </div>
        </div>

        {/* Volume and Options */}
        <div className="flex items-center space-x-3 w-1/4 justify-end">
          <button className="text-gray-400 hover:text-white transition-colors">
            <FiMaximize2 className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2">
            <FiVolume2 className="w-4 h-4 text-gray-400" />
            <div className="w-24 h-1 bg-gray-600 rounded-full cursor-pointer group">
              <div 
                className="h-full bg-white rounded-full relative group-hover:bg-green-400 transition-colors"
                style={{ width: `${volume}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
