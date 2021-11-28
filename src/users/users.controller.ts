import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: '회원가입',
    description: 'id와 password를 입력하여 회원가입 할 수 있습니다.',
  })
  @ApiCreatedResponse({
    description: '회원 가입 성공',
    schema: {
      properties: {
        message: { default: '회원 가입 성공' },
        userId: { default: 1 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: '이미 존재하는 id로 가입 시도',
    schema: {
      properties: { message: { default: '이미 사용중인 아이디입니다.' } },
    },
  })
  @Post()
  create(@Body() userCredentialsDto: UserCredentialsDto) {
    return this.usersService.create(userCredentialsDto);
  }
}
