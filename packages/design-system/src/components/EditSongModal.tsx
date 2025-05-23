'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, Music2, Image } from 'lucide-react';
import { Modal } from './ui/modal';

interface Song {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  audioUrl?: string;
}

interface EditSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: {
    name?: string;
    artist?: string;
    audioFile?: File;
    coverImage?: File;
  }) => void;
  song: Song | null;
  isLoading?: boolean;
}

export function EditSongModal({ isOpen, onClose, onSubmit, song, isLoading }: EditSongModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [songFile, setSongFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the first input when modal opens
  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Populate form when song changes
  useEffect(() => {
    if (song) {
      setTitle(song.name);
      setArtist(song.artist);
    }
  }, [song]);

  const clearForm = () => {
    setSongFile(null);
    setCoverFile(null);
    setTitle('');
    setArtist('');
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) {
      setCoverFile(file);
    } else if (file?.type.startsWith('audio/')) {
      setSongFile(file);
    }
  };

  const handleSongFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSongFile(file);
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!song) return;

    // Only include fields that have changed
    const updateData: any = {};
    
    if (title !== song.name) {
      updateData.name = title;
    }
    
    if (artist !== song.artist) {
      updateData.artist = artist;
    }
    
    if (coverFile) {
      updateData.coverImage = coverFile;
    }
    
    if (songFile) {
      updateData.audioFile = songFile;
    }

    // Only submit if there are changes
    if (Object.keys(updateData).length > 0) {
      onSubmit(song.id, updateData);
      clearForm();
    }
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  const getApiBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.protocol + '//' + window.location.hostname + ':3001';
    }
    return 'http://localhost:3001';
  };

  if (!song) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Song">
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="space-y-2 sm:space-y-4">
          <label className="block text-sm font-medium text-zinc-700">
            Song Title <span className="text-red-500">*</span>
          </label>
          <input
            ref={titleInputRef}
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-colors text-sm sm:text-base"
            placeholder="Enter song title"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2 sm:space-y-4">
          <label className="block text-sm font-medium text-zinc-700">
            Artist Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-colors text-sm sm:text-base"
            placeholder="Enter artist name"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2 sm:space-y-4">
          <label className="block text-sm font-medium text-zinc-700">
            Cover Image <span className="text-xs sm:text-sm text-zinc-500">(Optional - current image will be kept if not changed)</span>
          </label>
          <div className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors ${isDragging ? 'border-violet-500 bg-violet-50' : 'border-zinc-300 hover:border-violet-500'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {coverFile ? (
              <div className="flex items-center justify-center gap-2 text-violet-600">
                <Image className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base truncate">{coverFile.name}</span>
              </div>
            ) : (
              <div className="space-y-2">
                {song.imageUrl && (
                  <div className="mb-3 sm:mb-4">
                    <img
                      src={`${getApiBaseUrl()}/storage/${song.imageUrl}`}
                      alt="Current cover"
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg mx-auto"
                    />
                    <p className="text-xs text-zinc-500 mt-2">Current cover image</p>
                  </div>
                )}
                <Image className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-zinc-400" />
                <p className="text-xs sm:text-sm text-zinc-600">
                  <span className="block sm:inline">Drag and drop a new cover image here, or{' '}</span>
                  <label className="text-violet-600 hover:text-violet-700 cursor-pointer">
                    browse
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverFileChange}
                      disabled={isLoading}
                    />
                  </label>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 sm:space-y-4">
          <label className="block text-sm font-medium text-zinc-700">
            Audio File <span className="text-xs sm:text-sm text-zinc-500">(Optional)</span>
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors ${
              isDragging
                ? 'border-violet-500 bg-violet-50'
                : 'border-zinc-300 hover:border-violet-500'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {songFile ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-violet-600">
                <div className="flex items-center gap-2">
                  <Music2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base truncate">{songFile.name}</span>
                </div>
                <span className="text-xs text-zinc-500">(New file selected)</span>
              </div>
            ) : (
              <div className="space-y-2">
                {song.audioUrl && (
                  <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-zinc-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-zinc-600">
                      <Music2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm font-medium">Audio file exists</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">Current audio file will be kept if not changed</p>
                  </div>
                )}
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-zinc-400" />
                <p className="text-xs sm:text-sm text-zinc-600">
                  <span className="block sm:inline">Drag and drop a new audio file here, or{' '}</span>
                  <label className="text-violet-600 hover:text-violet-700 cursor-pointer">
                    browse
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={handleSongFileChange}
                      disabled={isLoading}
                    />
                  </label>
                </p>
                {!song.audioUrl && (
                  <p className="text-xs text-zinc-500">No audio file currently associated with this song</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-zinc-600 hover:text-zinc-900 transition-colors order-2 sm:order-1"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white px-6 py-2 rounded-lg hover:from-violet-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 