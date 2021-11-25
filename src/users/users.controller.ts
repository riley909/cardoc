import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() userCredentialsDto: UserCredentialsDto) {
    return this.usersService.create(userCredentialsDto);
  }
}
