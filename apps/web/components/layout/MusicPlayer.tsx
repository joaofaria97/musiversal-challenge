'use client';

import { PlayButton } from '@musiversal/design-system';
import { SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { Music2 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function MusicPlayer() {
  const { 
    currentSong, 
    isPlaying, 
    isMuted, 
    volume, 
    currentTime, 
    duration, 
    togglePlayPause, 
    toggleMute, 
    setVolume,
    seekTo 
  } = useMusic();

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(e.target.value));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    seekTo(newTime);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Hide music player when no song is selected
  if (!currentSong) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-zinc-200 p-2 sm:p-4 z-40">
      <div className="container mx-auto">
        {/* Mobile Layout: Compact Single Row */}
        <div className="sm:hidden">
          <div className="flex items-center gap-2">
            {/* Smaller Album Art */}
            <div className="w-10 h-10 rounded-md bg-zinc-100 flex items-center justify-center flex-shrink-0">
              <img 
                src={`${API_BASE_URL}/storage/${currentSong.imageUrl}`}
                alt={`${currentSong.name} cover`}
                className="w-full h-full rounded-md object-cover"
              />
            </div>
            
            {/* Song Info - Compact */}
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-zinc-900 truncate text-xs leading-tight">
                {currentSong.name}
              </h3>
              <p className="text-xs text-zinc-500 truncate leading-tight">
                {currentSong.artist}
              </p>
            </div>

            {/* Play Button - Small */}
            <PlayButton 
              isPlaying={isPlaying}
              onClick={togglePlayPause}
              size="sm"
              disabled={!currentSong.audioUrl}
            />

            {/* Volume Toggle - Simple */}
            <button 
              onClick={toggleMute}
              className="text-zinc-600 hover:text-indigo-600 transition-colors p-1 hover:bg-zinc-50 rounded-full flex-shrink-0"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" strokeWidth={1.5} />
              ) : (
                <Volume2 className="w-4 h-4" strokeWidth={1.5} />
              )}
            </button>
          </div>
          
          {/* Progress Bar - Below, minimal */}
          <div className="mt-1.5">
            <input
              type="range"
              min="0"
              max="100"
              value={progressPercentage}
              onChange={handleSeek}
              className="w-full h-1 bg-zinc-200 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, rgb(139 92 246) 0%, rgb(139 92 246) ${progressPercentage}%, rgb(228 228 231) ${progressPercentage}%, rgb(228 228 231) 100%)`
              }}
            />
          </div>
        </div>

        {/* Desktop Layout: Horizontal */}
        <div className="hidden sm:flex items-center justify-between">
          {/* Left: Song Info */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="w-14 h-14 rounded-lg shadow-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
              <img 
                src={`${API_BASE_URL}/storage/${currentSong.imageUrl}`}
                alt={`${currentSong.name} cover`}
                className="w-full h-full rounded-lg object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-zinc-900 truncate">
                {currentSong.name}
              </h3>
              <p className="text-sm text-zinc-600 truncate">
                {currentSong.artist}
              </p>
            </div>
          </div>

          {/* Center: Play Button and Progress Bar */}
          <div className="flex flex-col items-center gap-3 px-8 flex-1">
            {/* Play Button */}
            <PlayButton 
              isPlaying={isPlaying}
              onClick={togglePlayPause}
              size="lg"
              disabled={!currentSong.audioUrl}
            />
            
            {/* Progress Bar */}
            <div className="flex items-center gap-3 w-full max-w-lg">
              <span className="text-xs text-zinc-500 w-10 text-right font-mono">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressPercentage}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, rgb(139 92 246) 0%, rgb(139 92 246) ${progressPercentage}%, rgb(228 228 231) ${progressPercentage}%, rgb(228 228 231) 100%)`
                  }}
                />
              </div>
              <span className="text-xs text-zinc-500 w-10 font-mono">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right: Volume Controls */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <button 
              onClick={toggleMute}
              className="text-zinc-600 hover:text-indigo-600 transition-colors p-2 hover:bg-zinc-50 rounded-full"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" strokeWidth={1.5} />
              ) : (
                <Volume2 className="w-5 h-5" strokeWidth={1.5} />
              )}
            </button>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 accent-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 