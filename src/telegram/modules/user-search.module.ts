import { Module } from '@nestjs/common';
import { ProfileModule } from './profile.module';
import { UsersSearchService } from '../services/users-search.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from '../db/mongo/profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
  ],
  providers: [UsersSearchService],
  exports: [UsersSearchService],
})
export class UsersSearchModule {}
