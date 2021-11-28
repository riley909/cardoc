import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { ResponseMessages } from 'src/response-messages.enum';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateUserTireDto } from './dto/create-usertire.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UserTire } from './entities/usertire.entity';
import { TrimId } from './enums/trimId.enum';

@Injectable()
export class UserTiresService {
  constructor(
    @InjectRepository(UserTire)
    private userTireRepository: Repository<UserTire>,
    private usersService: UsersService,
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

  async create(
    createUserTireDtos: CreateUserTireDto[],
  ): Promise<{ message: string }> {
    const limit = 5;

    if (createUserTireDtos.length > limit) {
      throw new BadRequestException(ResponseMessages.OUT_OF_LIMIT);
    }

    const tires = [];

    for (let i = 0; i < createUserTireDtos.length; i++) {
      const id = createUserTireDtos[i].id;
      const user = await this.usersService.findById(id);

      const trimId = createUserTireDtos[i].trimId;

      const tire = await this.userTireRepository.findOne({
        where: { user, trimId },
      });
      if (tire) throw new BadRequestException(ResponseMessages.TIRE_DUPLICATE);

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

  async findTireByUserId(
    id: string,
    paginationDto: PaginationDto,
  ): Promise<{
    message: string;
    totalPage: number;
    currentPage: number;
    results: UserTire[];
  }> {
    let { page, pageSize } = paginationDto;
    page = page || 1;
    pageSize = pageSize || 10;

    const user = await this.usersService.findById(id);

    const [tires, count] = await this.userTireRepository.findAndCount({
      where: { user },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    const totalPage = Math.ceil(count / pageSize);

    return {
      message: ResponseMessages.READ_TIRE_SUCCESS,
      totalPage: totalPage,
      currentPage: page,
      results: tires,
    };
  }
}
