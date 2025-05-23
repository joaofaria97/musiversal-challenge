'use client';

import { Card, CardContent, PlayButton, ConfirmModal, EditSongModal } from "@musiversal/design-system";
import { useSongs } from "@/hooks/api/useSongs";
import { Upload, Music2, User, Edit, Trash2, MoreVertical, Search, X, Music, VolumeX } from "lucide-react";
import { useState, useEffect, useRef, memo } from "react";
import { UploadSongModal } from "@musiversal/design-system";
import { toast } from '@musiversal/design-system';
import { useMusic } from '@/contexts/MusicContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Define Song interface for TypeScript
interface Song {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  audioUrl?: string;
}

// Memoized SongCard component to prevent unnecessary re-renders
const SongCard = memo(({ 
  song, 
  onPlay, 
  onEdit, 
  onDelete, 
  openMenuId, 
  onToggleMenu,
  isCurrentSong,
  isPlaying 
}: {
  song: Song;
  onPlay: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  openMenuId: string | null;
  onToggleMenu: (id: string) => void;
  isCurrentSong: boolean;
  isPlaying: boolean;
}) => (
  <Card 
    key={song.id} 
    variant="bordered" 
    className="hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border border-zinc-200 rounded-xl transform hover:-translate-y-1 relative"
  >
    <div className="aspect-square relative group overflow-hidden rounded-t-xl -m-px">
      <div className="absolute inset-0 overflow-hidden rounded-t-xl">
        <img
          src={`${API_BASE_URL}/storage/${song.imageUrl}`}
          alt={`${song.name} cover`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      {song.audioUrl ? (
        <div className="absolute top-2 right-2 bg-violet-500/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1 z-10">
          <Music className="w-3 h-3" />
        </div>
      ) : (
        <div className="absolute top-2 right-2 bg-zinc-400/80 text-zinc-200 text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1 z-10">
          <Music className="w-3 h-3" />
        </div>
      )}
      {/* Always visible play button on mobile, hover on desktop */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/40 to-transparent flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 z-10">
        <PlayButton 
          onClick={() => onPlay(song.id)}
          size="lg"
          disabled={!song.audioUrl}
          isPlaying={isCurrentSong && isPlaying}
        />
      </div>
    </div>
    <CardContent className="p-3 sm:p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate text-zinc-900 text-sm sm:text-base">{song.name}</h3>
          <p className="text-xs sm:text-sm text-zinc-600 truncate flex items-center gap-1">
            <User className="w-3 h-3" />
            {song.artist}
          </p>
        </div>
        <div className="relative ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMenu(song.id);
            }}
            className="text-zinc-400 hover:text-zinc-600 transition-colors p-1 rounded-full hover:bg-zinc-50"
            title="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {openMenuId === song.id && (
            <>
              {/* Invisible backdrop for this specific menu */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => onToggleMenu(song.id)}
              />
              
              {/* Desktop: Dropdown Menu */}
              <div className="hidden sm:block absolute right-0 top-8 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 z-50 min-w-[120px]">
                <button
                  onClick={() => {
                    onEdit(song.id);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(song.id, song.name);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>

              {/* Mobile: Bottom Action Sheet */}
              <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-200 rounded-t-xl shadow-xl animate-in slide-in-from-bottom duration-200">
                <div className="p-4">
                  {/* Handle bar */}
                  <div className="w-12 h-1 bg-zinc-300 rounded-full mx-auto mb-4"></div>
                  
                  {/* Song info */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-100">
                    <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
                      <img 
                        src={`${API_BASE_URL}/storage/${song.imageUrl}`}
                        alt={`${song.name} cover`}
                        className="w-full h-full rounded-lg object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-zinc-900 truncate text-sm">
                        {song.name}
                      </h3>
                      <p className="text-xs text-zinc-500 truncate">
                        {song.artist}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        onEdit(song.id);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors rounded-lg"
                    >
                      <Edit className="w-5 h-5" />
                      Edit Song
                    </button>
                    <button
                      onClick={() => {
                        onDelete(song.id, song.name);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete Song
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
));

SongCard.displayName = 'SongCard';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [previousSongs, setPreviousSongs] = useState<Song[] | undefined>(undefined);
  const [audioFilter, setAudioFilter] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { songs, isLoading, createSong, isUploading, deleteSong, isDeleting, updateSong, isUpdating } = useSongs(debouncedSearch || undefined);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; songId: string; songName: string }>({
    isOpen: false,
    songId: '',
    songName: ''
  });
  const { playSong, currentSong, isPlaying } = useMusic();

  // Keep track of previous songs to show during loading
  useEffect(() => {
    if (songs && !isLoading) {
      setPreviousSongs(songs);
    }
  }, [songs, isLoading]);

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Maintain focus on search input after results load
  useEffect(() => {
    if (!isLoading && searchInputRef.current && document.activeElement !== searchInputRef.current && searchTerm) {
      searchInputRef.current.focus();
    }
  }, [isLoading, searchTerm]);

  const clearSearch = () => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  const handleUpload = async (data: {
    title: string;
    artist: string;
    songFile?: File;
    coverFile: File;
  }) => {
    try {
      // Validate cover image (required)
      if (!data.coverFile.type.startsWith('image/')) {
        toast.error('Please upload a valid image file (jpg, jpeg, png)');
        return;
      }

      // Validate audio file if provided (optional)
      if (data.songFile && !data.songFile.type.startsWith('audio/')) {
        toast.error('Please upload a valid audio file (mp3, wav, ogg)');
        return;
      }

      // Validate file sizes
      const MAX_AUDIO_SIZE = 100 * 1024 * 1024; // 100MB
      const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

      if (data.songFile && data.songFile.size > MAX_AUDIO_SIZE) {
        toast.error('Audio file size must be less than 100MB');
        return;
      }

      if (data.coverFile.size > MAX_IMAGE_SIZE) {
        toast.error('Image file size must be less than 10MB');
        return;
      }

      // Create song using the mutation with the correct file fields
      await createSong({
        name: data.title,
        artist: data.artist,
        audioFile: data.songFile,
        coverImage: data.coverFile,
      });
      
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error('Upload error:', error);
      // Error toast is handled by the useSongs hook
    }
  };

  const handlePlay = (songId: string) => {
    const song = (songs || previousSongs)?.find((s: Song) => s.id === songId);
    if (!song?.audioUrl) {
      toast.error('No audio file available for this song');
      return;
    }
    playSong(song);
  };

  const handleEdit = (songId: string) => {
    const song = (songs || previousSongs)?.find((s: Song) => s.id === songId);
    if (song) {
      setEditingSong(song);
      setIsEditModalOpen(true);
    }
    setOpenMenuId(null);
  };

  const handleEditSubmit = async (id: string, data: any) => {
    try {
      await updateSong(id, data);
      setIsEditModalOpen(false);
      setEditingSong(null);
    } catch (error) {
      console.error('Edit error:', error);
    }
  };

  const handleDeleteClick = (songId: string, songName: string) => {
    setDeleteConfirm({
      isOpen: true,
      songId,
      songName
    });
    setOpenMenuId(null);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.songId) {
      await deleteSong(deleteConfirm.songId);
      setDeleteConfirm({ isOpen: false, songId: '', songName: '' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, songId: '', songName: '' });
  };

  const toggleMenu = (songId: string) => {
    setOpenMenuId(openMenuId === songId ? null : songId);
  };

  // Use current songs if available, otherwise show previous songs to prevent flashing
  let displaySongs = songs || previousSongs;
  
  // Apply audio filter if enabled
  if (audioFilter && displaySongs) {
    displaySongs = displaySongs.filter((song: Song) => song.audioUrl);
  }
  
  const isInitialLoading = isLoading && !previousSongs;

  if (isInitialLoading) {
    return (
      <div className="min-h-full">
        <div className="container mx-auto p-8">
          <div className="text-center text-zinc-600">Loading songs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {/* Sticky Header */}
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
              onClick={() => setIsUploadModalOpen(true)}
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
              onClick={() => setIsUploadModalOpen(true)}
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-9 sm:pl-10 pr-8 sm:pr-9 py-1.5 sm:py-2 border border-zinc-200/60 rounded-lg focus:ring-1 focus:ring-violet-400 focus:border-violet-400 outline-none transition-colors bg-white/80 text-xs sm:text-sm placeholder-zinc-400"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
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
                    onChange={(e) => setAudioFilter(e.target.checked)}
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

      {/* Main Content */}
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Empty state message */}
        {displaySongs && displaySongs.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <Music2 className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-zinc-200" />
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-zinc-500 mb-2">
                {searchTerm || audioFilter ? 'No songs found' : 'No songs yet'}
              </h3>
              <p className="text-sm sm:text-base text-zinc-400 mb-6">
                {searchTerm 
                  ? `No songs match "${searchTerm}". Try searching for something else.`
                  : audioFilter 
                    ? 'No songs with audio files found. Try turning off the audio filter or upload songs with audio files.'
                    : 'Start building your music collection by uploading your first song.'
                }
              </p>
              {!searchTerm && !audioFilter && (
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  disabled={isUploading}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-700 px-4 py-2 sm:px-6 sm:py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mx-auto text-sm sm:text-base border border-zinc-200 hover:border-zinc-300"
                >
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                  Upload Your First Song
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
            {displaySongs?.map((song: Song) => (
              <SongCard
                key={song.id}
                song={song}
                onPlay={handlePlay}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                openMenuId={openMenuId}
                onToggleMenu={toggleMenu}
                isCurrentSong={currentSong?.id === song.id}
                isPlaying={isPlaying}
              />
            ))}
          </div>
        )}
      </div>

      <UploadSongModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUpload}
        isLoading={isUploading}
      />

      <EditSongModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        song={editingSong}
        isLoading={isUpdating}
      />

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Song"
        description={`Are you sure you want to delete "${deleteConfirm.songName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
} 