import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TrimId } from '../enums/trimId.enum';

export class CreateUserTireDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id: string;

  @IsNotEmpty()
  @IsEnum(TrimId)
  @ApiProperty()
  trimId: TrimId;
}
