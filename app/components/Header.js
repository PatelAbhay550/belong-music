import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiBell, FiUser } from "react-icons/fi";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <Image
              src="/LOGO.svg"
              alt="Belong Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <h1 className="text-xl font-bold text-white">BELONG</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-green-400 transition-colors font-medium">
              Home
            </Link>
            <Link href="/search" className="text-gray-300 hover:text-white transition-colors">
              Search
            </Link>
            <Link href="/library" className="text-gray-300 hover:text-white transition-colors">
              Your Library
            </Link>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <SearchBar />
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-300 hover:text-white transition-colors">
            <FiBell className="w-5 h-5" />
          </button>
          <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 rounded-full px-3 py-1 transition-colors">
            <FiUser className="w-4 h-4 text-white" />
            <span className="text-white text-sm">Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
}
