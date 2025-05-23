import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateSongDto {
  @ApiProperty({ description: 'The name of the song' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'The artist of the song' })
  @IsNotEmpty()
  @IsString()
  artist: string;
} 