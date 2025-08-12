import { Injectable } from '@nestjs/common';
import { ProfileValidator } from 'src/validations/Profile.validator';
import { Context } from 'telegraf';
import { SessionManager } from '../sessions/sessionManager.session';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';
import { SessionSteps } from 'src/enums/session-steps.enum';
import { locationKeyboard } from '../keyboards/location/location.keyboard';
import { MessageValidator } from 'src/validations/message.validator';
import { ProfileService } from '../services/profile.service';
import { createGeoPoint } from 'src/utils/location.util';
import { mainProfileKeyboard } from '../keyboards/profile/mainProfile.keyboard';

@Injectable()
export class UpdateLocationCommand {
  constructor(
    private readonly sessionManager: SessionManager<ISessionSchema>,
    private readonly profileService: ProfileService,
  ) {}
  async handler(ctx: Context) {
    const userId = ctx.chat?.id;
    if (!userId) return;

    if (ProfileValidator.isGeoLocation(ctx)) {
      console.log('true update');

      const session = this.sessionManager.get(userId);
      if (session?.sessionManager?.step === SessionSteps.LOCATION) {
        const { latitude, longitude } = ctx.message.location;
        const newLocation = createGeoPoint(longitude, latitude);
        await this.profileService.updateProfileUser(
          userId,
          'location',
          newLocation,
        );
        this.sessionManager.endAll(userId);

        return ctx.reply('✅ Геолокацію збережено!', mainProfileKeyboard);
      }
    }

    if (MessageValidator.isTextMessage(ctx)) {
      console.log('Update location!');

      this.sessionManager.start(userId, 'sessionManager', {
        step: SessionSteps.LOCATION,
        data: {},
      });
      return ctx.reply('Надішли свою нову геолокацію', locationKeyboard);
    }
  }
}
