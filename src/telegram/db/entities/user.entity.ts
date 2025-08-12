import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SendMessage } from './send-message.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  telegram_id: number;

  @Column()
  name: string;

  @OneToOne(() => SendMessage, (send) => send.userId)
  sendId: SendMessage;

  @Column()
  username: string;
}
