import { Module } from '@nestjs/common';
import { UserTiresService } from './usertires.service';
import { UserTiresController } from './usertires.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTire } from './entities/usertire.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserTire, User])],
  providers: [UserTiresService],
  controllers: [UserTiresController],
})
export class UserTiresModule {}
