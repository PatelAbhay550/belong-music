"use client";

import { useLikedSongs } from "../hooks/useLikedSongs";

export default function DebugLikedSongs() {
  const { likedSongs, toggleLike } = useLikedSongs();

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  // Test song object
  const testSong = {
    id: 'test-123',
    name: 'Test Song',
    artists: { primary: [{ name: 'Test Artist' }] },
    image: [],
    album: { name: 'Test Album' },
    duration: 180
  };

  const handleTestLike = () => {
    console.log('🧪 Testing like functionality...');
    toggleLike(testSong);
  };

  const handleClearStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('likedSongs');
      window.location.reload();
    }
  };

  const getStorageContent = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('likedSongs');
      return stored;
    }
    return null;
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-95 text-white p-4 rounded-lg text-xs max-w-sm z-50 max-h-96 overflow-y-auto">
      <div className="font-bold mb-2 text-green-400">🐛 Debug: Liked Songs ({likedSongs.length})</div>
      
      {/* Test buttons */}
      <div className="mb-3 space-y-1">
        <button 
          onClick={handleTestLike} 
          className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 mr-2"
        >
          Test Like
        </button>
        <button 
          onClick={handleClearStorage} 
          className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
        >
          Clear Storage
        </button>
      </div>
      
      {/* localStorage inspection */}
      <div className="mb-2 text-yellow-300">
        <div className="font-semibold">localStorage content:</div>
        <div className="text-xs text-gray-300 max-h-20 overflow-y-auto bg-gray-800 p-1 rounded">
          {getStorageContent() || 'empty'}
        </div>
      </div>

      {/* Songs list */}
      <div className="max-h-32 overflow-y-auto">
        {likedSongs.length === 0 ? (
          <div className="text-gray-300">No liked songs</div>
        ) : (
          likedSongs.map((song, index) => (
            <div key={song.id} className="mb-1 text-gray-200 border-b border-gray-600 pb-1">
              <div className="font-semibold">{index + 1}. {song.name}</div>
              <div className="text-xs text-gray-400">ID: {song.id}</div>
              <div className="text-xs text-gray-400">
                Artist: {song.artists?.primary?.[0]?.name || 'Unknown'}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Manual refresh button */}
      <button 
        onClick={() => window.location.reload()} 
        className="mt-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
      >
        Refresh
      </button>
    </div>
  );
}
