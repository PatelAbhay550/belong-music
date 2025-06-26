import Image from "next/image";
import Link from "next/link";

export default function NotionMusicCard({ item, type, index, onPlay, isPlaying, onLike, isLiked, showPlayedAt, playedAt }) {
  const getImageUrl = () => {
    if (item.image && Array.isArray(item.image)) {
      return item.image[2]?.url || item.image[1]?.url || item.image[0]?.url;
    }
    return item.image || '/LOGO.svg';
  };

  const getTitle = () => {
    return item.name || item.title || 'Unknown';
  };

  const getSubtitle = () => {
    if (type === 'song') {
      return item.album?.name || item.artists?.primary?.[0]?.name || 'Unknown Artist';
    }
    if (type === 'album') {
      return item.artists?.primary?.[0]?.name || 'Unknown Artist';
    }
    if (type === 'playlist') {
      return `${item.songCount || 0} songs`;
    }
    return '';
  };

  const getHref = () => {
    if (type === 'song') {
      return `/${item.id}`;
    }
    if (type === 'album') {
      return `/album/${item.id}`;
    }
    if (type === 'playlist') {
      // Generate a query based on the playlist name or use a meaningful search term
      const query = item.name ? item.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') : 'trending';
      return `/playlist/${query}`;
    }
    return '#';
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'song': return '🎵';
      case 'album': return '💿';
      case 'playlist': return '📋';
      default: return '🎵';
    }
  };

  return (
    <Link href={getHref()}>
      <div className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer bg-white">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100">
          <Image
            src={getImageUrl() || '/LOGO.svg'}
            alt={getTitle()}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {/* Play overlay */}
          <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onPlay) onPlay(item, index);
                }}
                className="opacity-0 group-hover:opacity-100 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 transition-all duration-200 transform scale-90 group-hover:scale-100"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              
              {/* Like button - only show for songs */}
              {type === 'song' && onLike && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onLike(item);
                  }}
                  className={`opacity-0 group-hover:opacity-100 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 transition-all duration-200 transform scale-90 group-hover:scale-100 ${
                    isLiked ? 'text-red-600' : 'text-gray-900'
                  }`}
                  title={isLiked ? "Remove from favorites" : "Add to favorites"}
                >
                  <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {/* Index number */}
          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
            #{index}
          </div>
          {/* Type indicator */}
          <div className="absolute top-2 right-2 bg-white bg-opacity-90 text-xs px-2 py-1 rounded-full">
            {getTypeIcon()}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 truncate mb-1">
            {getTitle()}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {getSubtitle()}
          </p>
          
          {/* Additional info for songs */}
          {type === 'song' && (
            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
              <span>{item.duration ? `${Math.floor(item.duration / 60)}:${String(item.duration % 60).padStart(2, '0')}` : ''}</span>
              {showPlayedAt && playedAt ? (
                <span>Played {new Date(playedAt).toLocaleDateString()}</span>
              ) : (
                <span>{item.year}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
