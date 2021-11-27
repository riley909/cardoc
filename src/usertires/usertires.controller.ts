import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserTireDto } from './dto/create-usertire.dto';
import { UserTire } from './entities/usertire.entity';
import { UserTiresService } from './usertires.service';

@Controller('usertires')
export class UserTiresController {
  constructor(private userTiresService: UserTiresService) {}

  @Post()
  create(
    @Body() createUserTireDto: CreateUserTireDto[],
  ): Promise<{ message: string }> {
    return this.userTiresService.create(createUserTireDto);
  }

  @Get(':id')
  findTireByUserId(
    @Param('id') id: string,
  ): Promise<{ message: string; tire: UserTire[] }> {
    return this.userTiresService.findTireByUserId(id);
  }
}
