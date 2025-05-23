'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, Music2, Image } from 'lucide-react';
import { Modal } from './ui/modal';

interface UploadSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    artist: string;
    songFile?: File;
    coverFile: File;
  }) => void;
  isLoading?: boolean;
}

export function UploadSongModal({ isOpen, onClose, onSubmit, isLoading }: UploadSongModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [songFile, setSongFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the first input when modal opens
  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      // Small delay to ensure modal is fully rendered
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

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
    if (coverFile) {
      onSubmit({
        title,
        artist,
        songFile: songFile || undefined,
        coverFile,
      });
      clearForm();
    }
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload Song">
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
            Cover Image <span className="text-red-500">*</span>
          </label>
          <div className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors ${isDragging ? 'border-violet-500 bg-violet-50' : 'border-zinc-300 hover:border-violet-500'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {coverFile ? (
              <div className="flex items-center justify-center gap-2 text-violet-600">
                <Image className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base truncate">{coverFile.name}</span>
              </div>
            ) : (
              <div className="space-y-2">
                <Image className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-zinc-400" />
                <p className="text-xs sm:text-sm text-zinc-600">
                  <span className="block sm:inline">Drag and drop your cover image here, or{' '}</span>
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
            Audio File <span className="text-sm text-zinc-500">(Optional)</span>
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
              <div className="flex items-center justify-center gap-2 text-violet-600">
                <Music2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base truncate">{songFile.name}</span>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-zinc-400" />
                <p className="text-xs sm:text-sm text-zinc-600">
                  <span className="block sm:inline">Drag and drop your audio file here, or{' '}</span>
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
            disabled={isLoading || !coverFile}
            className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white px-6 py-2 rounded-lg hover:from-violet-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
          >
            {isLoading ? 'Uploading...' : 'Upload Song'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 