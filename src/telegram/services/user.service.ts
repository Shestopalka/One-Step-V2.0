import { Inject, Injectable } from '@nestjs/common';
import { Users } from '../db/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async createUser(
    telegram_id: number,
    username: string,
    first_name: string,
  ): Promise<Users | null> {
    try {
      const user = await this.usersRepository.create({
        telegram_id: telegram_id,
        username: username,
        name: first_name,
      });
      console.log('This user ->>>>>', user);

      return await this.usersRepository.save(user);
    } catch (err) {
      return err;
    }
  }
}
