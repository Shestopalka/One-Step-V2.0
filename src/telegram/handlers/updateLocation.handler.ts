import { Injectable } from '@nestjs/common';
import { ProfileValidator } from 'src/validations/Profile.validator';
import { Context } from 'telegraf';
import { SessionManager } from '../sessions/sessionManager.session';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';
import { HandlerSteps } from 'src/enums/handler-steps.enum';
import { UpdateLocationCommand } from '../commands/update-location.command';
import { MessageValidator } from 'src/validations/message.validator';

@Injectable()
export class UpdateLocationHandler {
  constructor(
    private readonly sessionManager: SessionManager<ISessionSchema>,
    private readonly updateLocationCommand: UpdateLocationCommand,
  ) {}

  async updateHandler(ctx: Context) {
    return this.updateLocationCommand.handler(ctx);
  }

  async handler(ctx: Context, userId: number) {
    const session = this.sessionManager.get(userId);
    if (!session?.handlerStatus) return;
    console.log('This geolocation?', ProfileValidator.isGeoLocation(ctx));

    if (ProfileValidator.isGeoLocation(ctx)) {
      console.log('test!!!');

      return await this.updateHandler(ctx);
    } else if (MessageValidator.isTextMessage(ctx)) {
      if (session.handlerStatus.step === HandlerSteps.UPDATE_LOCATION) {
        return this.updateHandler(ctx);
      }
    }
  }
}
