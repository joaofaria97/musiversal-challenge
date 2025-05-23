import { ApiProperty } from '@nestjs/swagger';

export class Song {
  @ApiProperty({ description: 'The unique identifier of the song' })
  id: string;

  @ApiProperty({ description: 'The name of the song' })
  name: string;

  @ApiProperty({ description: 'The artist of the song' })
  artist: string;

  @ApiProperty({ description: 'The URL/path to the song image' })
  imageUrl: string;

  @ApiProperty({ description: 'The URL/path to the song audio file', required: false })
  audioUrl?: string;
} 