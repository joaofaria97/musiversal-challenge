'use client';

import { useState, useEffect } from 'react';
import { Song } from '@/types/song';

export function useSearchAndFilter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [audioFilter, setAudioFilter] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  const filterSongs = (songs: Song[] | undefined): Song[] | undefined => {
    if (!songs) return songs;
    
    if (audioFilter) {
      return songs.filter(song => song.audioUrl);
    }
    
    return songs;
  };

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearch,
    audioFilter,
    setAudioFilter,
    clearSearch,
    filterSongs,
  };
} 