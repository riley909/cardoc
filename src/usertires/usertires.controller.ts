import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserTireDto } from './dto/create-usertire.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UserTire } from './entities/usertire.entity';
import { UserTiresService } from './usertires.service';

@ApiTags('usertires')
@Controller('usertires')
export class UserTiresController {
  constructor(private userTiresService: UserTiresService) {}

  @ApiOperation({
    summary: '타이어 정보 저장',
    description:
      '회원 id와 trimId를 입력하여 타이어 정보를 가져와 저장합니다. 최대 5개의 요청까지 가능합니다. 입력의 형태는 배열이어야 합니다.',
  })
  @ApiBody({ type: [CreateUserTireDto] })
  @ApiCreatedResponse({
    description: '타이어 정보 저장 성공',
    schema: {
      properties: {
        message: { default: '타이어 정보 저장 성공' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: '요청 5개 이상',
    schema: {
      properties: { message: { default: '최대 요청 범위를 벗어났습니다.' } },
    },
  })
  @Post()
  create(
    @Body() createUserTireDto: CreateUserTireDto[],
  ): Promise<{ message: string }> {
    return this.userTiresService.create(createUserTireDto);
  }

  @ApiOperation({
    summary: '타이어 정보 조회',
    description: '회원 id를 입력하여 해당 회원의 타이어 정보를 조회합니다.',
  })
  @ApiOkResponse({
    description: '타이어 정보 조회 성공',
    schema: {
      properties: {
        message: { default: '타이어 정보 조회 성공' },
        totalPage: { default: 4 },
        currentPage: { default: 1 },
        results: {
          properties: {
            tires: {
              type: 'array',
              items: {
                properties: {
                  userTireId: { default: 17 },
                  trimId: { default: 5000 },
                  frontWidth: { default: 225 },
                  frontAspectRatio: { default: 60 },
                  frontWheelSize: { default: 16 },
                  rearWidth: { default: 225 },
                  rearAspectRatio: { default: 60 },
                  rearWheelSize: { default: 16 },
                },
              },
            },
          },
        },
      },
    },
  })
  @Get(':id')
  findTireByUserId(
    @Param('id') id: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<{
    message: string;
    totalPage: number;
    currentPage: number;
    results: UserTire[];
  }> {
    return this.userTiresService.findTireByUserId(id, paginationDto);
  }
}
