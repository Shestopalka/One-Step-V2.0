import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class SendMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users, (user) => user.sendId)
  @JoinColumn() // Ось цей декоратор потрібен, щоб TypeORM знав, що ця сторона керує зовнішнім ключем
  userId: Users;

  @CreateDateColumn()
  createdAt: Date;
}
