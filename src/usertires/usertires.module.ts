import { Module } from '@nestjs/common';
import { UserTiresService } from './usertires.service';
import { UserTiresController } from './usertires.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTire } from './entities/usertire.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserTire]), UsersModule],
  providers: [UserTiresService],
  controllers: [UserTiresController],
})
export class UserTiresModule {}
