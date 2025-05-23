'use client';

import { Play, Pause } from 'lucide-react';

interface PlayButtonProps {
  isPlaying?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export function PlayButton({ 
  isPlaying = false, 
  onClick, 
  size = 'md', 
  disabled = false,
  className = '' 
}: PlayButtonProps) {
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const buttonClasses = disabled 
    ? `
        bg-zinc-400 text-zinc-200 rounded-full cursor-not-allowed
        flex items-center justify-center opacity-60
        ${sizeClasses[size]} ${className}
      `
    : `
        bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-full 
        hover:from-violet-600 hover:to-indigo-600 transition-all duration-300 
        shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 
        flex items-center justify-center
        ${sizeClasses[size]} ${className}
      `;

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={buttonClasses}
      title={disabled ? 'No audio available' : (isPlaying ? 'Pause' : 'Play')}
    >
      {isPlaying ? (
        <Pause className={`${iconSizes[size]} strokeWidth={1.5}`} />
      ) : (
        <Play className={`${iconSizes[size]} ml-0.5 strokeWidth={1.5}`} />
      )}
    </button>
  );
} 