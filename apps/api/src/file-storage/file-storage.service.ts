import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileStorageService {
  private readonly storagePath = path.join(process.cwd(), 'storage');

  constructor() {
    this.initializeStorage();
  }

  private async initializeStorage() {
    try {
      // Create storage directory if it doesn't exist
      await fs.mkdir(this.storagePath, { recursive: true });
      
      // Create subdirectories for different file types
      await fs.mkdir(path.join(this.storagePath, 'images'), { recursive: true });
      await fs.mkdir(path.join(this.storagePath, 'audio'), { recursive: true });
    } catch (error) {
      console.error('Failed to initialize storage:', error);
    }
  }

  async saveFile(file: Express.Multer.File, type: 'image' | 'audio'): Promise<string> {
    const subdirectory = type === 'image' ? 'images' : 'audio';
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    const fileName = `${baseName}-${uuidv4()}${extension}`;
    const targetPath = path.join(this.storagePath, subdirectory, fileName);
    
    // Write the file to the target location
    await fs.writeFile(targetPath, file.buffer);
    
    // Return the relative path for storage in the database
    return path.join(subdirectory, fileName);
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(this.storagePath, filePath);
    try {
      await fs.unlink(fullPath);
    } catch (error) {
      console.error(`Failed to delete file ${filePath}:`, error);
    }
  }
}
