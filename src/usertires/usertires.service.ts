import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
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
      // trimId가 유효하지 않음
      // TODO: statusMessage
      throw new BadRequestException('3');
    }

    const front = result.frontTire.value;
    const rear = result.rearTire.value;

    return { front, rear };
  }

  getTireInfo(tire) {
    const reg = /^[0-9]{3}\/[0-9]{2}R[0-9]{2}$/g;
    const isMatch = reg.test(tire);

    if (!isMatch) {
      // 데이터가 타이어 정보 양식에 맞지 않음
      // TODO: statusMessage
      throw new BadRequestException('2');
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
      // 최대 요청 범위를 벗어남
      // TODO: statusMessage
      throw new BadRequestException('1');
    }

    for (let i = 0; i < createUserTireDtos.length; i++) {
      const id = createUserTireDtos[i].id;
      const user = await this.usersRepository.findOne({ where: { id: id } });
      const trimId = createUserTireDtos[i].trimId;

      const tireInfo = await this.loadCarData(trimId);
      const front = this.getTireInfo(tireInfo.front);
      const rear = this.getTireInfo(tireInfo.rear);

      const userTire = await this.userTireRepository.create({
        user,
        trimId,
        frontWidth: front.width,
        frontAspectRatio: front.aspectRatio,
        frontWheelSize: front.wheelSize,
        rearWidth: rear.width,
        rearAspectRatio: rear.aspectRatio,
        rearWheelSize: rear.wheelSize,
      });

      await this.userTireRepository.save(userTire);
    }

    return;
  }
}
