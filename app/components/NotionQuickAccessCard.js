"use client";

import { useRouter } from 'next/navigation';

export default function NotionQuickAccessCard({ title, icon, subtitle, color, onClick, href }) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    }
  };

  return (
    <div 
      className="group border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer bg-white"
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{title}</h3>
          <p className="text-sm text-gray-500 truncate">{subtitle}</p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
