import { Module } from '@nestjs/common';
import { CreateProfileHandler } from '../handlers/createProfile.handler';
import { CommandsModule } from '../commands/commands.module';
import { ForwarderHandler } from '../handlers/forwarder.handler';
import { SessionModule } from './session.module';
import { editProfileHandler } from '../handlers/editProfile.handler';
import { UpdateLocationHandler } from '../handlers/updateLocation.handler';
import { GetProfileHandler } from '../handlers/getProfile.handler';
import { GetNearbyUsersHandler } from '../handlers/get-nearby-users.handler';

@Module({
  imports: [CommandsModule, SessionModule],
  providers: [
    CreateProfileHandler,
    ForwarderHandler,
    editProfileHandler,
    UpdateLocationHandler,
    GetProfileHandler,
    GetNearbyUsersHandler,
  ],
  exports: [
    CreateProfileHandler,
    ForwarderHandler,
    editProfileHandler,
    UpdateLocationHandler,
    GetProfileHandler,
    GetNearbyUsersHandler,
  ],
})
export class HandlersModule {}
