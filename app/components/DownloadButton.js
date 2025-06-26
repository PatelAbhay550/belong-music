export default function DownloadButton({ quality, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="duration-300 cursor-pointer hover:text-slate-400 hover:bg-slate-600 hover:scale-95 px-3 py-2 font-semibold rounded-md shadow-lg bg-slate-700 flex flex-col items-center min-w-[80px] transition-all"
    >
      <span className="text-sm font-bold">{quality}</span>
      <span className="text-xs text-gray-300">{description}</span>
    </button>
  );
}
