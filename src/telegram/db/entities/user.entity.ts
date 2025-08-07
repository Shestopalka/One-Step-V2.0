import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  telegram_id: number;

  @Column()
  name: string;

  @Column()
  username: string;
}
