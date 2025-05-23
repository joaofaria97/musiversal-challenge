import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSongDto {
  @ApiProperty({ description: 'The name of the song', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'The artist of the song', required: false })
  @IsOptional()
  @IsString()
  artist?: string;
} 