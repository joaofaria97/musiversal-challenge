import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { FileStorageService } from '../file-storage/file-storage.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song } from './entities/song.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SongService {
  private readonly dataPath = path.join(process.cwd(), 'data', 'songs.json');

  constructor(private readonly fileStorageService: FileStorageService) {
    this.initializeData();
  }

  private async initializeData() {
    try {
      // Create data directory if it doesn't exist
      const dataDir = path.join(process.cwd(), 'data');
      await fs.mkdir(dataDir, { recursive: true });
      
      // Initialize songs.json if it doesn't exist
      try {
        await fs.access(this.dataPath);
      } catch {
        await fs.writeFile(this.dataPath, JSON.stringify([], null, 2));
      }
    } catch (error) {
      console.error('Failed to initialize song data:', error);
    }
  }

  private async isIdUnique(id: string): Promise<boolean> {
    const songs = await this.findAll();
    return !songs.some(song => song.id === id);
  }

  async findAll(search?: string): Promise<Song[]> {
    const data = await fs.readFile(this.dataPath, 'utf-8');
    const songs: Song[] = JSON.parse(data);
    
    if (!search) {
      return songs;
    }
    
    const searchTerm = search.toLowerCase();
    return songs.filter(song => 
      song.name.toLowerCase().includes(searchTerm) || 
      song.artist.toLowerCase().includes(searchTerm)
    );
  }

  async create(
    createSongDto: CreateSongDto,
    coverImage: Express.Multer.File,
    audioFile?: Express.Multer.File,
  ): Promise<Song> {
    const songs = await this.findAll();
    
    // Save the cover image
    const imageUrl = await this.fileStorageService.saveFile(coverImage, 'image');
    
    // Save the audio file if provided
    let audioUrl: string | undefined;
    if (audioFile) {
      audioUrl = await this.fileStorageService.saveFile(audioFile, 'audio');
    }

    const newSong: Song = {
      id: uuidv4(),
      name: createSongDto.name,
      artist: createSongDto.artist,
      imageUrl,
      audioUrl,
    };

    songs.push(newSong);
    await fs.writeFile(this.dataPath, JSON.stringify(songs, null, 2));
    return newSong;
  }

  async update(
    id: string,
    updateSongDto: UpdateSongDto,
    coverImage?: Express.Multer.File,
    audioFile?: Express.Multer.File,
  ): Promise<Song | null> {
    const songs = await this.findAll();
    const index = songs.findIndex(s => s.id === id);
    if (index === -1) return null;

    const song = songs[index];
    const updates: Partial<Song> = {};

    // Update metadata if provided
    if (updateSongDto.name) updates.name = updateSongDto.name;
    if (updateSongDto.artist) updates.artist = updateSongDto.artist;

    // Update cover image if provided
    if (coverImage) {
      // Delete old cover image
      if (song.imageUrl) {
        await this.fileStorageService.deleteFile(song.imageUrl);
      }
      // Save new cover image
      updates.imageUrl = await this.fileStorageService.saveFile(coverImage, 'image');
    }

    // Update audio file if provided
    if (audioFile) {
      // Delete old audio file
      if (song.audioUrl) {
        await this.fileStorageService.deleteFile(song.audioUrl);
      }
      // Save new audio file
      updates.audioUrl = await this.fileStorageService.saveFile(audioFile, 'audio');
    }

    // Apply updates
    const updatedSong = { ...song, ...updates };
    songs[index] = updatedSong;
    await fs.writeFile(this.dataPath, JSON.stringify(songs, null, 2));
    return updatedSong;
  }

  async delete(id: string): Promise<boolean> {
    const songs = await this.findAll();
    const song = songs.find(s => s.id === id);
    if (!song) return false;

    // Delete associated files
    if (song.imageUrl) {
      await this.fileStorageService.deleteFile(song.imageUrl);
    }
    if (song.audioUrl) {
      await this.fileStorageService.deleteFile(song.audioUrl);
    }

    const updatedSongs = songs.filter(s => s.id !== id);
    await fs.writeFile(this.dataPath, JSON.stringify(updatedSongs, null, 2));
    return true;
  }

  async saveFile(file: Express.Multer.File, type: 'image' | 'audio'): Promise<string> {
    return this.fileStorageService.saveFile(file, type);
  }
}
