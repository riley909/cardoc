import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserCredentialsDto } from 'src/users/dto/user-credentials.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { ResponseMessages } from 'src/response-messages.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userCredentialsDto: UserCredentialsDto): Promise<boolean> {
    const { id, password } = userCredentialsDto;

    const user = await this.usersService.findById(id);
    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      return true;
    } else {
      throw new UnauthorizedException(ResponseMessages.USER_DATA_MISS_MATCH);
    }
  }

  async login(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<{ message: string; accessToken: string }> {
    const { id } = userCredentialsDto;
    const isValidate = this.validateUser(userCredentialsDto);

    if (isValidate) {
      const payload = { id };
      const accessToken: string = await this.jwtService.sign(payload);
      return { message: ResponseMessages.LOGIN_SUCCESS, accessToken };
    }
  }
}
