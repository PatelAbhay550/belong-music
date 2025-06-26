export default function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors duration-200"
    >
      <svg 
        className="w-5 h-5 text-white" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 19l-7-7 7-7" 
        />
      </svg>
    </button>
  );
}
