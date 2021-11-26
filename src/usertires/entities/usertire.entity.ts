import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserTire {
  @PrimaryGeneratedColumn()
  userTireId: number;

  @Column()
  trimId: number;

  @Column()
  frontWidth: number;

  @Column()
  frontAspectRatio: number;

  @Column()
  frontWheelSize: number;

  @Column()
  rearWidth: number;

  @Column()
  rearAspectRatio: number;

  @Column()
  rearWheelSize: number;

  @ManyToOne(() => User, (user) => user.userTires, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}
