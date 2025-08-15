import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendMessage } from '../db/entities/send-message.entity';
import { UserModule } from './user.module';
import { ProfileModule } from './profile.module';
import { SendMessageService } from '../services/send-message.service';
import { UsersSearchModule } from './user-search.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SendMessage]),
    UserModule,
    ProfileModule,
    UsersSearchModule,
  ],
  providers: [SendMessageService],
  exports: [SendMessageService],
})
export class SendMessageModule {}
