'use client';

import { useState } from 'react';
import { Song } from '@/types/song';

interface DeleteConfirmState {
  isOpen: boolean;
  songId: string;
  songName: string;
}

export function useModals() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState>({
    isOpen: false,
    songId: '',
    songName: ''
  });

  const openUploadModal = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);

  const openEditModal = (song: Song) => {
    setEditingSong(song);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingSong(null);
  };

  const openDeleteConfirm = (songId: string, songName: string) => {
    setDeleteConfirm({
      isOpen: true,
      songId,
      songName
    });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({
      isOpen: false,
      songId: '',
      songName: ''
    });
  };

  return {
    // Upload Modal
    isUploadModalOpen,
    openUploadModal,
    closeUploadModal,
    
    // Edit Modal
    isEditModalOpen,
    editingSong,
    openEditModal,
    closeEditModal,
    
    // Delete Confirm
    deleteConfirm,
    openDeleteConfirm,
    closeDeleteConfirm,
  };
} 