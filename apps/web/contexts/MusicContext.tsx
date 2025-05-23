'use client';

import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

interface Song {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  audioUrl?: string;
}

interface MusicContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  togglePlayPause: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
    };
  }, []);

  // Update audio source when song changes
  useEffect(() => {
    if (audioRef.current && currentSong?.audioUrl) {
      audioRef.current.src = `${API_BASE_URL}/storage/${currentSong.audioUrl}`;
      audioRef.current.load();
    }
  }, [currentSong, API_BASE_URL]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Update mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const pauseSong = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !currentSong?.audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
  }, [isPlaying, currentSong]);

  const playSong = useCallback((song: Song) => {
    if (!song.audioUrl) {
      return;
    }

    // If it's the same song, just toggle play/pause
    if (currentSong?.id === song.id) {
      togglePlayPause();
      return;
    }

    // Set new song and play
    setCurrentSong(song);
    setCurrentTime(0);
    
    // Audio will be loaded in useEffect and then we can play
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
      }
    }, 100);
  }, [currentSong, togglePlayPause]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(100, newVolume)));
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const value: MusicContextType = {
    currentSong,
    isPlaying,
    isMuted,
    volume,
    currentTime,
    duration,
    playSong,
    pauseSong,
    togglePlayPause,
    toggleMute,
    setVolume,
    seekTo,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
} 