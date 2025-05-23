'use client';

import { ConfirmModal, EditSongModal, UploadSongModal } from "@musiversal/design-system";
import { useSongs } from "@/hooks/api/useSongs";
import { useState, useEffect } from "react";
import { useMusic } from '@/contexts/MusicContext';
import { useModals } from '@/hooks/ui/useModals';
import { useSongActions } from '@/hooks/ui/useSongActions';
import { useSearchAndFilter } from '@/hooks/ui/useSearchAndFilter';
import { SearchHeader } from '@/components/layout/SearchHeader';
import { SongCard } from '@/components/songs/SongCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Song } from '@/types/song';

export default function Home() {
  const [previousSongs, setPreviousSongs] = useState<Song[] | undefined>(undefined);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  // Custom hooks for state management
  const { 
    searchTerm, 
    setSearchTerm, 
    debouncedSearch, 
    audioFilter, 
    setAudioFilter, 
    clearSearch, 
    filterSongs 
  } = useSearchAndFilter();
  
  const { 
    isUploadModalOpen, 
    openUploadModal, 
    closeUploadModal,
    isEditModalOpen, 
    editingSong, 
    openEditModal, 
    closeEditModal,
    deleteConfirm, 
    openDeleteConfirm, 
    closeDeleteConfirm 
  } = useModals();

  // API hooks
  const { songs, isLoading, createSong, isUploading, deleteSong, isDeleting, updateSong, isUpdating } = useSongs(debouncedSearch || undefined);
  const { currentSong, isPlaying } = useMusic();

  // Song action handlers
  const {
    handleUpload,
    handlePlay,
    handleEdit,
    handleEditSubmit,
    handleDeleteClick,
    handleDeleteConfirm,
  } = useSongActions({
    createSong,
    updateSong,
    deleteSong,
    openEditModal,
    openDeleteConfirm,
    closeDeleteConfirm,
    closeUploadModal,
    closeEditModal,
    songs
  });

  // Keep track of previous songs to show during loading
  useEffect(() => {
    if (songs && !isLoading) {
      setPreviousSongs(songs);
    }
  }, [songs, isLoading]);

  const toggleMenu = (songId: string) => {
    setOpenMenuId(prev => prev === songId ? null : songId);
  };

  // Use current songs if available, otherwise show previous songs to prevent flashing
  let displaySongs = songs || previousSongs;
  
  // Apply audio filter if enabled
  displaySongs = filterSongs(displaySongs);
  
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
      <SearchHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClearSearch={clearSearch}
        audioFilter={audioFilter}
        onAudioFilterChange={setAudioFilter}
        isLoading={isLoading}
        onUploadClick={openUploadModal}
        isUploading={isUploading}
      />

      {/* Main Content */}
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 pb-20 sm:pb-32">
        {displaySongs && displaySongs.length === 0 ? (
          <EmptyState
            searchTerm={searchTerm}
            audioFilter={audioFilter}
            onUploadClick={openUploadModal}
            isUploading={isUploading}
          />
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

      {/* Modals */}
      <UploadSongModal 
        isOpen={isUploadModalOpen} 
        onClose={closeUploadModal}
        onSubmit={handleUpload}
        isLoading={isUploading}
      />

      <EditSongModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleEditSubmit}
        song={editingSong}
        isLoading={isUpdating}
      />

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={closeDeleteConfirm}
        onConfirm={() => handleDeleteConfirm(deleteConfirm.songId)}
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