'use client';

import { useMusic } from '@/contexts/MusicContext';
// import { toast } from '@musiversal/design-system'; // Keep toast import if other parts use it, but remove from these handlers
import { Song } from '@/types/song';
import type { SongControllerCreateBody } from '@musiversal/api-client'; // Import the type

interface UseSongActionsProps {
  createSong: (data: SongControllerCreateBody, options?: any) => void; // Loosen type for options temporarily for easier merge
  updateSong: (id: string, data: any, options?: any) => void; // Loosen type for options
  deleteSong: (id: string, options?: any) => void;
  openEditModal: (song: Song) => void;
  openDeleteConfirm: (songId: string, songName: string) => void;
  closeDeleteConfirm: () => void;
  songs?: Song[];
  closeUploadModal: () => void; // Added
  closeEditModal: () => void;   // Added
}

export function useSongActions({
  createSong,
  updateSong,
  deleteSong,
  openEditModal,
  openDeleteConfirm,
  closeDeleteConfirm,
  closeUploadModal, // Added
  closeEditModal,   // Added
  songs
}: UseSongActionsProps) {
  const { playSong } = useMusic();

  const handleUpload = (data: {
    title: string;
    artist: string;
    songFile?: File;
    coverFile: File;
  }) => {
    console.log('Data received in handleUpload:', data);
    console.log('coverFile object:', data.coverFile);
    if (data.songFile) {
      console.log('songFile object:', data.songFile);
    }
    try {
      // DO NOT create FormData here. Pass a plain object.
      const songData: SongControllerCreateBody = {
        name: data.title,
        artist: data.artist,
        coverImage: data.coverFile, // Pass File object, it's compatible with Blob
      };

      if (data.songFile) {
        songData.audioFile = data.songFile; // Pass File object
      }

      createSong(songData, {
        onSuccess: () => {
          closeUploadModal();
        }
      });
      // Toasts are handled by useSongs.ts
    } catch (error) {
      console.error('Upload error in useSongActions:', error);
      // Errors should also be primarily handled by useSongs.ts onError
      // but you could re-throw or handle UI specific fallback here if needed.
    }
  };

  const handlePlay = (songId: string) => {
    const song = songs?.find(s => s.id === songId);
    if (song && song.audioUrl) {
      playSong(song);
    }
  };

  const handleEdit = (songId: string) => {
    const song = songs?.find(s => s.id === songId);
    if (song) {
      openEditModal(song);
    }
  };

  const handleEditSubmit = (id: string, data: any) => {
    try {
      updateSong(id, data, {
        onSuccess: () => {
          closeEditModal();
        }
      });
    } catch (error) {
      console.error('Update error in useSongActions:', error);
    }
  };

  const handleDeleteClick = (songId: string, songName: string) => {
    openDeleteConfirm(songId, songName);
  };

  const handleDeleteConfirm = (songId: string) => {
    try {
      deleteSong(songId);
      // toast.success('Song deleted successfully!'); // REMOVED
      closeDeleteConfirm();
    } catch (error) {
      console.error('Delete error:', error);
      // toast.error('Failed to delete song'); // REMOVED
    }
  };

  return {
    handleUpload,
    handlePlay,
    handleEdit,
    handleEditSubmit,
    handleDeleteClick,
    handleDeleteConfirm,
  };
} 