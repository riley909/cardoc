import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserCredentialsDto } from 'src/users/dto/user-credentials.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

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
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async login(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { id } = userCredentialsDto;
    const isValidate = this.validateUser(userCredentialsDto);

    if (isValidate) {
      const payload = { id };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    }
  }
}
