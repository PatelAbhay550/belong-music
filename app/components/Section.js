import AlbumCard from "./AlbumCard";
import SongCard from "./SongCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Section({ title, albums, songs, showViewAll = true, type = "albums" }) {
  const items = type === "songs" ? songs : albums;
  
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-2xl font-bold hover:underline cursor-pointer">
          {title}
        </h2>
        {showViewAll && (
          <button className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
            Show all
          </button>
        )}
      </div>

      <div className="relative group">
        {/* Navigation Arrows */}
        <button className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-black/80 hover:bg-black rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FiChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-black/80 hover:bg-black rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FiChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items?.slice(0, 6).map((item) => (
            type === "songs" ? (
              <SongCard key={item.id} song={item} />
            ) : (
              <AlbumCard 
                key={item.id} 
                album={item} 
                type={type === "charts" ? "playlist" : type === "playlists" ? "playlist" : "album"}
              />
            )
          ))}
        </div>
      </div>
    </section>
  );
}
