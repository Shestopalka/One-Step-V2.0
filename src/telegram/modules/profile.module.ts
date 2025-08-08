import { Module } from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from '../db/mongo/profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
  ],
  providers: [ProfileService],
  exports: [ProfileService, MongooseModule],
})
export class ProfileModule {}
