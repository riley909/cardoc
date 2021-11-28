import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @ApiProperty()
  page: number;

  @IsOptional()
  @ApiProperty()
  pageSize: number;
}
