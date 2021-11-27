import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserTireDto } from './dto/create-usertire.dto';
import { UserTiresService } from './usertires.service';

@Controller('usertires')
export class UserTiresController {
  constructor(private userTiresService: UserTiresService) {}

  @Post()
  create(@Body() createUserTireDto: CreateUserTireDto[]) {
    return this.userTiresService.create(createUserTireDto);
  }

  @Get(':id')
  findTireByUserId(@Param('id') id: string) {
    return this.userTiresService.findTireByUserId(id);
  }
}
