import { ConflictException, Injectable } from '@nestjs/common';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userCredentialsDto: UserCredentialsDto) {
    const { id, password } = userCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      id,
      password: hashedPassword,
    });

    try {
      const result = await this.usersRepository.save(user);
      return result.userId;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`user id already exists`);
      }
    }
  }

  async findById(id: string): Promise<User> {
    const user = this.usersRepository.findOne({ id });
    return user;
  }
}
