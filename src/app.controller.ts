import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { UserCredentialsDto } from './users/dto/user-credentials.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('login')
  async login(
    @Body() userCredentialsDto: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(userCredentialsDto);
  }
}
