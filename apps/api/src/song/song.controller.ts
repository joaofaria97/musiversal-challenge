import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseInterceptors, UploadedFiles, ParseFilePipe, BadRequestException, Logger } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiBody, ApiParam, ApiQuery, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { SongService } from './song.service';
import { Song } from './entities/song.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { FileTypeAndSizeValidator } from './validators/file-validators';

@ApiTags('Songs')
@Controller('songs')
export class SongController {
  private readonly logger = new Logger(SongController.name);

  constructor(private readonly songService: SongService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all songs', 
    description: 'Retrieves a list of all songs in the system. Optionally filter by search term.' 
  })
  @ApiQuery({
    name: 'search',
    description: 'Search term to filter songs by name or artist',
    required: false,
    type: String,
  })
  @ApiOkResponse({
    description: 'List of songs retrieved successfully',
    type: [Song],
  })
  async findAll(@Query('search') search?: string): Promise<Song[]> {
    return this.songService.findAll(search);
  }

  @Post()
  @ApiOperation({ 
    summary: 'Create a new song',
    description: 'Creates a new song with required metadata and files. Cover image is required, audio file is optional.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the song',
        },
        artist: {
          type: 'string',
          description: 'The artist of the song',
        },
        coverImage: {
          type: 'string',
          format: 'binary',
          description: 'The cover image file (jpg, jpeg, png) - max 10MB',
        },
        audioFile: {
          type: 'string',
          format: 'binary',
          description: 'The audio file (mp3, wav, ogg) - max 100MB',
        },
      },
      required: ['name', 'artist', 'coverImage'],
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'coverImage', maxCount: 1 },
      { name: 'audioFile', maxCount: 1 },
    ]),
  )
  async create(
    @Body() createSongDto: CreateSongDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeAndSizeValidator({
            fieldName: 'coverImage',
            allowedMimeTypes: /^image\/(jpeg|png)$/,
            maxSize: 10 * 1024 * 1024
          }),
          new FileTypeAndSizeValidator({
            fieldName: 'audioFile',
            allowedMimeTypes: /^audio\/(mpeg|wav|ogg)$/,
            maxSize: 100 * 1024 * 1024
          }),
        ],
      }),
    )
    files: { coverImage?: Express.Multer.File[]; audioFile?: Express.Multer.File[] },
  ): Promise<Song> {
    console.log('Files received:', files);
    
    if (!files.coverImage?.[0]) {
      throw new BadRequestException('Cover image is required');
    }
    const coverImage = files.coverImage[0];
    const audioFile = files.audioFile?.[0];

    console.log('Cover image details:', {
      filename: coverImage.originalname,
      mimetype: coverImage.mimetype,
      size: coverImage.size
    });

    return this.songService.create(createSongDto, coverImage, audioFile);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Update a song',
    description: 'Updates an existing song by its ID. Can update metadata and/or files.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    description: 'The ID of the song to update',
    type: String,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the song',
        },
        artist: {
          type: 'string',
          description: 'The artist of the song',
        },
        coverImage: {
          type: 'string',
          format: 'binary',
          description: 'The cover image file (jpg, jpeg, png) - max 10MB',
        },
        audioFile: {
          type: 'string',
          format: 'binary',
          description: 'The audio file (mp3, wav, ogg) - max 100MB',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'The song has been successfully updated',
    type: Song,
  })
  @ApiNotFoundResponse({
    description: 'Song not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data provided',
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'coverImage', maxCount: 1 },
      { name: 'audioFile', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @Body() updateSongDto: UpdateSongDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeAndSizeValidator({
            fieldName: 'coverImage',
            allowedMimeTypes: /^image\/(jpeg|png)$/,
            maxSize: 10 * 1024 * 1024
          }),
          new FileTypeAndSizeValidator({
            fieldName: 'audioFile',
            allowedMimeTypes: /^audio\/(mpeg|wav|ogg)$/,
            maxSize: 100 * 1024 * 1024
          }),
        ],
        fileIsRequired: false,
      }),
    )
    files?: { coverImage?: Express.Multer.File[]; audioFile?: Express.Multer.File[] },
  ): Promise<Song | null> {
    console.log('Update files received:', files);
    
    const coverImage = files?.coverImage?.[0];
    const audioFile = files?.audioFile?.[0];

    if (coverImage) {
      console.log('Cover image details:', {
        filename: coverImage.originalname,
        mimetype: coverImage.mimetype,
        size: coverImage.size
      });
    }

    return this.songService.update(id, updateSongDto, coverImage, audioFile);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a song', description: 'Deletes a song and its associated files by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the song to delete',
    type: String,
  })
  @ApiOkResponse({
    description: 'The song has been successfully deleted',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Song not found',
  })
  async delete(@Param('id') id: string): Promise<{ success: boolean }> {
    const success = await this.songService.delete(id);
    return { success };
  }
} 
