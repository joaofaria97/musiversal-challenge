'use client';

import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  isPlaying?: boolean;
  isMuted?: boolean;
  onPlayPause?: () => void;
  onMute?: () => void;
  songName?: string;
  artistName?: string;
  imageUrl?: string;
}

export function MusicPlayer({
  isPlaying = false,
  isMuted = false,
  onPlayPause,
  onMute,
  songName = "Sample Song",
  artistName = "Artist Name",
  imageUrl,
}: MusicPlayerProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Song Info */}
          <div className="flex items-center gap-3 min-w-[200px]">
            <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={songName}
                  className="w-full h-full object-cover rounded-md"
                />
              )}
            </div>
            <div className="truncate">
              <div className="font-medium">{songName}</div>
              <div className="text-sm text-gray-500">{artistName}</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="flex items-center gap-4">
              <button
                onClick={onPlayPause}
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
            </div>
            <div className="w-full flex items-center gap-2">
              <span className="text-xs text-gray-500">0:00</span>
              <div className="flex-1 h-1 bg-gray-200 rounded-full">
                <div className="w-0 h-full bg-blue-600 rounded-full" />
              </div>
              <span className="text-xs text-gray-500">3:45</span>
            </div>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2 min-w-[100px]">
            <button
              onClick={onMute}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <div className="w-20 h-1 bg-gray-200 rounded-full">
              <div className="w-1/2 h-full bg-blue-600 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 