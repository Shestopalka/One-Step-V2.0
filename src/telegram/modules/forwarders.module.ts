import { Module } from '@nestjs/common';
import { CreateProfileForwarder } from '../../forwarders/createProfile.forwarder';
import { EditProfileForwarder } from '../../forwarders/editProfile.forwarder';
import { UpdateLocationForwarder } from '../../forwarders/updateLocation.forwarder';
import { GetProfileForwarder } from '../../forwarders/getProfile.forwarder';
import { GetNearbyUsersForwarder } from '../../forwarders/nearbyUsers.forwarder';
import { HandlersModule } from './handlers.module';
import { SessionModule } from './session.module';
import { MainForwarder } from '../../forwarders/mainForwarder.forwarder';

@Module({
  imports: [HandlersModule, SessionModule],
  providers: [
    CreateProfileForwarder,
    EditProfileForwarder,
    UpdateLocationForwarder,
    GetProfileForwarder,
    GetNearbyUsersForwarder,
    {
      provide: 'FORWARDERS',
      useFactory: (
        createProfile: CreateProfileForwarder,
        editProfile: EditProfileForwarder,
        updateLocation: UpdateLocationForwarder,
        getProfile: GetProfileForwarder,
        getNearbyUsers: GetNearbyUsersForwarder,
      ) => [
        createProfile,
        editProfile,
        updateLocation,
        getProfile,
        getNearbyUsers,
      ],
      inject: [
        CreateProfileForwarder,
        EditProfileForwarder,
        UpdateLocationForwarder,
        GetProfileForwarder,
        GetNearbyUsersForwarder,
      ],
    },
    MainForwarder,
  ],
  exports: [
    MainForwarder,
    CreateProfileForwarder,
    EditProfileForwarder,
    UpdateLocationForwarder,
    GetProfileForwarder,
    GetNearbyUsersForwarder,
  ],
})
export class ForwardersModule {}
