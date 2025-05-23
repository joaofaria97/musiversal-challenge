'use client';

import { Card, CardContent, PlayButton } from "@musiversal/design-system";
import { User, Edit, Trash2, MoreVertical, Music } from "lucide-react";
import { memo } from "react";
import { Song } from '@/types/song';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface SongCardProps {
  song: Song;
  onPlay: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  openMenuId: string | null;
  onToggleMenu: (id: string) => void;
  isCurrentSong: boolean;
  isPlaying: boolean;
}

export const SongCard = memo(({ 
  song, 
  onPlay, 
  onEdit, 
  onDelete, 
  openMenuId, 
  onToggleMenu,
  isCurrentSong,
  isPlaying 
}: SongCardProps) => (
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
              <div className="hidden sm:block absolute right-0 bottom-8 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 z-50 min-w-[120px]">
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