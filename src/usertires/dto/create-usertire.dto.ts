import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TrimId } from '../enums/trimId.enum';

export class CreateUserTireDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsEnum(TrimId)
  trimId: TrimId;
}
