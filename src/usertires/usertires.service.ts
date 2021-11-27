import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { ResponseMessages } from 'src/response-messages.enum';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserTireDto } from './dto/create-usertire.dto';
import { UserTire } from './entities/usertire.entity';
import { TrimId } from './enums/trimId.enum';

@Injectable()
export class UserTiresService {
  constructor(
    @InjectRepository(UserTire)
    private userTireRepository: Repository<UserTire>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async loadCarData(trimId: TrimId) {
    const result = await axios
      .get(`https://dev.mycar.cardoc.co.kr/v1/trim/${trimId}`)
      .then((data) => data.data.spec.driving)
      .catch((e) => console.log('error', e));

    if (!result) {
      throw new BadRequestException(ResponseMessages.INVALID_TRIM_ID);
    }

    const front = result.frontTire.value;
    const rear = result.rearTire.value;

    return { front, rear };
  }

  getTireInfo(tire) {
    const reg = /^[0-9]{3}\/[0-9]{2}R[0-9]{2}$/g;
    const isMatch = reg.test(tire);

    if (!isMatch) {
      throw new BadRequestException(ResponseMessages.INVALID_TIRE_VALUE);
    }

    const half = tire.split('/');
    const quarter = half[1].split('R');
    const width = half[0];
    const aspectRatio = quarter[0];
    const wheelSize = quarter[1];

    return { width, aspectRatio, wheelSize };
  }

  async create(createUserTireDtos: CreateUserTireDto[]) {
    const limit = 5;

    if (createUserTireDtos.length > limit) {
      throw new BadRequestException(ResponseMessages.OUT_OF_LIMIT);
    }

    const tires = [];

    for (let i = 0; i < createUserTireDtos.length; i++) {
      const id = createUserTireDtos[i].id;
      const user = await this.usersRepository.findOne({ where: { id: id } });

      if (!user) throw new BadRequestException(ResponseMessages.INVALID_USER);

      const trimId = createUserTireDtos[i].trimId;

      const tireInfo = await this.loadCarData(trimId);
      const front = this.getTireInfo(tireInfo.front);
      const rear = this.getTireInfo(tireInfo.rear);
      tires.push({
        user,
        trimId,
        frontWidth: front.width,
        frontAspectRatio: front.aspectRatio,
        frontWheelSize: front.wheelSize,
        rearWidth: rear.width,
        rearAspectRatio: rear.aspectRatio,
        rearWheelSize: rear.wheelSize,
      });
    }

    try {
      await this.userTireRepository
        .createQueryBuilder()
        .insert()
        .into(UserTire)
        .values(tires)
        .execute();
      return { message: ResponseMessages.TIRE_SAVE_SUCCESS };
    } catch (e) {
      throw new InternalServerErrorException(
        ResponseMessages.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
