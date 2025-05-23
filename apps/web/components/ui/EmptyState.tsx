'use client';

import { Music2, Upload } from 'lucide-react';

interface EmptyStateProps {
  searchTerm?: string;
  audioFilter?: boolean;
  onUploadClick?: () => void;
  isUploading?: boolean;
}

export function EmptyState({ searchTerm, audioFilter, onUploadClick, isUploading }: EmptyStateProps) {
  const getEmptyStateContent = () => {
    if (searchTerm) {
      return {
        title: 'No songs found',
        description: `No songs match "${searchTerm}". Try searching for something else.`,
        showUploadButton: false
      };
    }
    
    if (audioFilter) {
      return {
        title: 'No songs found',
        description: 'No songs with audio files found. Try turning off the audio filter or upload songs with audio files.',
        showUploadButton: false
      };
    }
    
    return {
      title: 'No songs yet',
      description: 'Start building your music collection by uploading your first song.',
      showUploadButton: true
    };
  };

  const { title, description, showUploadButton } = getEmptyStateContent();

  return (
    <div className="text-center py-12 sm:py-16">
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <Music2 className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-zinc-200" />
        </div>
        <h3 className="text-lg sm:text-xl font-medium text-zinc-500 mb-2">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-zinc-400 mb-6">
          {description}
        </p>
        {showUploadButton && onUploadClick && (
          <button
            onClick={onUploadClick}
            disabled={isUploading}
            className="bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-700 px-4 py-2 sm:px-6 sm:py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mx-auto text-sm sm:text-base border border-zinc-200 hover:border-zinc-300"
          >
            <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
            Upload Your First Song
          </button>
        )}
      </div>
    </div>
  );
} 