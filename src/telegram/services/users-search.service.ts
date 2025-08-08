import { Injectable } from '@nestjs/common';
import { Profile, ProfileDocument } from '../db/mongo/profile.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersSearchService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
  ) {}

  async findNearbyUsers(telegram_id: number, maxDistance) {
    const existProfile = await this.profileModel.findOne({ telegram_id });
    if (!existProfile || !existProfile.location) return;

    const userCoordinates = existProfile.location.coordinates;
    console.log(userCoordinates[0], 'AND', userCoordinates[1]);

    return await this.profileModel.find({
      telegram_id: { $ne: telegram_id },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [userCoordinates[0], userCoordinates[1]],
          },
          $maxDistance: maxDistance,
        },
      },
    });
  }
}
