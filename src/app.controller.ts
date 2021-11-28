import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { UserCredentialsDto } from './users/dto/user-credentials.dto';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: '로그인',
    description: '유저 id와 password로 로그인 할 수 있습니다.',
  })
  @ApiOkResponse({
    description: '로그인 성공',
    schema: {
      properties: {
        message: { default: '로그인 성공' },
        accessToken: { default: 'accessToken' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: '잘못된 회원 정보 입력',
    schema: {
      properties: { message: { default: '회원 정보를 다시 확인해 주세요.' } },
    },
  })
  @Post('login')
  async login(
    @Body() userCredentialsDto: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(userCredentialsDto);
  }
}
