'use client';

import { Search, X, Music, Upload } from 'lucide-react';
import { useRef } from 'react';

interface SearchHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  audioFilter: boolean;
  onAudioFilterChange: (enabled: boolean) => void;
  isLoading: boolean;
  onUploadClick: () => void;
  isUploading: boolean;
}

export function SearchHeader({
  searchTerm,
  onSearchChange,
  onClearSearch,
  audioFilter,
  onAudioFilterChange,
  isLoading,
  onUploadClick,
  isUploading
}: SearchHeaderProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-zinc-200/50">
      <div className="container mx-auto p-2.5 sm:p-6 lg:px-8 lg:py-6">
        {/* Mobile Layout: Single Row */}
        <div className="sm:hidden flex items-center justify-between mb-2.5">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-zinc-900 font-cursive bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent select-none cursor-default">
              Vinly
            </h1>
          </div>
          <button
            onClick={onUploadClick}
            disabled={isUploading}
            className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white p-2 rounded-lg hover:from-violet-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ml-3"
            title={isUploading ? 'Uploading...' : 'Upload Song'}
          >
            <Upload className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Layout: Original */}
        <div className="hidden sm:flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-6 gap-3 sm:gap-0">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 font-cursive bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent select-none cursor-default">
              Vinly
            </h1>
            <p className="text-zinc-600 mt-0.5 sm:mt-1 text-xs sm:text-base">Your personal music collection</p>
          </div>
          <button
            onClick={onUploadClick}
            disabled={isUploading}
            className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl hover:from-violet-600 hover:to-indigo-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-xs sm:text-base"
          >
            <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
            {isUploading ? 'Uploading...' : 'Upload Song'}
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <div className="relative flex-1 sm:max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-500" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search songs or artists..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-9 sm:pl-10 pr-8 sm:pr-9 py-1.5 sm:py-2 border border-zinc-200/60 rounded-lg focus:ring-1 focus:ring-violet-400 focus:border-violet-400 outline-none transition-colors bg-white/80 text-xs sm:text-sm placeholder-zinc-400"
            />
            {searchTerm && (
              <button
                onClick={onClearSearch}
                className="absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            )}
            {/* Subtle loading indicator */}
            {isLoading && searchTerm && (
              <div className="absolute inset-y-0 right-7 sm:right-8 flex items-center">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border border-violet-300 border-t-violet-500 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          {/* Audio Filter Toggle */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <label className="flex items-center cursor-pointer" title="Show only songs with audio">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={audioFilter}
                  onChange={(e) => onAudioFilterChange(e.target.checked)}
                  className="sr-only"
                />
                <div className={`block w-8 h-5 sm:w-10 sm:h-6 rounded-full transition-colors ${
                  audioFilter 
                    ? 'bg-gradient-to-r from-violet-500 to-indigo-500' 
                    : 'bg-zinc-200'
                }`}>
                  <div className={`absolute left-0.5 top-0.5 sm:left-1 sm:top-1 bg-white w-4 h-4 sm:w-4 sm:h-4 rounded-full transition-transform flex items-center justify-center ${
                    audioFilter ? 'transform translate-x-3 sm:translate-x-4' : ''
                  }`}>
                    <Music className={`w-2 h-2 sm:w-2.5 sm:h-2.5 transition-colors ${
                      audioFilter ? 'text-violet-500' : 'text-zinc-400'
                    }`} />
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
} 