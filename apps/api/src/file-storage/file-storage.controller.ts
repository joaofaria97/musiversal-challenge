import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileStorageService } from './file-storage.service';
import { SongService } from 'src/song/song.service';

@ApiTags('files')
@Controller('files')
export class FileStorageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

} 