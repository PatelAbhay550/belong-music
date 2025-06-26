export default function QuickPlayCard({ title, image, subtitle, isLarge = false }) {
  return (
    <div className={`group bg-gray-800 hover:bg-gray-700 rounded-md overflow-hidden cursor-pointer transition-all duration-300 ${isLarge ? 'col-span-2' : ''}`}>
      <div className="flex items-center">
        <img
          src={image}
          alt={title}
          className={`${isLarge ? 'w-20 h-20' : 'w-16 h-16'} object-cover flex-shrink-0`}
        />
        <div className="flex-1 px-4 min-w-0">
          <h3 className="text-white font-medium text-sm truncate">{title}</h3>
          {subtitle && (
            <p className="text-gray-400 text-xs truncate mt-1">{subtitle}</p>
          )}
        </div>
        <div className="px-4">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300">
            <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
