import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from '../db/mongo/profile.schema';
import { ISessionData } from 'src/interfaces/session-data.interface';
import { createGeoPoint } from 'src/utils/location.util';
import { Location } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
  ) {}

  async createProfile(data: ISessionData): Promise<Profile | null> {
    try {
      const profile = await this.profileModel.create(data);
      return profile;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getProfile(telegram_id: number): Promise<ProfileDocument | null> {
    const userProfile = await this.profileModel.findOne({ telegram_id });
    console.log('This userProfile', userProfile);

    return userProfile;
  }

  async findProfileUser(telegram_id: number): Promise<boolean> {
    const exists = await this.profileModel.exists({ telegram_id });
    return !!exists;
  }

  async updateProfileUser<K extends keyof ISessionData>(
    userId: number,
    updateElement: string,
    value: ISessionData[K],
  ): Promise<void> {
    try {
      await this.profileModel.updateOne(
        { telegram_id: userId },
        { $set: { [updateElement]: value } },
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  async updateLocationUser(userId: number, location: Location) {
    const { latitude, longitude } = location;
    const newLocation = createGeoPoint(longitude, latitude);
    await this.updateProfileUser(userId, 'location', newLocation);
  }
}
