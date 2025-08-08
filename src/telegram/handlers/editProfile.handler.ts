import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { EditProfileCommand } from '../commands/editProfileCase/editProfile.command';
import { ProfileValidator } from 'src/validations/Profile.validator';
import { MessageValidator } from 'src/validations/message.validator';
import { HandlerSteps } from 'src/enums/handler-steps.enum';
import { SessionManager } from '../sessions/sessionManager.session';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';

@Injectable()
export class editProfileHandler {
  constructor(
    private readonly editProfileCommand: EditProfileCommand,
    private readonly sessionManager: SessionManager<ISessionSchema>,
  ) {}

  async eidtHandler(ctx: Context) {
    await this.editProfileCommand.handle(ctx);
  }

  async handler(ctx: Context, userId: number) {
    if (ProfileValidator.isGeoLocation(ctx)) {
      const session = this.sessionManager.get(userId);
      if (!session?.handlerStatus) return;

      if (session.handlerStatus.step === HandlerSteps.EDIT_PROFILE) {
        return await this.eidtHandler(ctx);
      }
    } else if (ProfileValidator.isPhoto(ctx)) {
      const session = this.sessionManager.get(userId);
      if (!session?.handlerStatus) return;
      if (session.handlerStatus.step === HandlerSteps.EDIT_PROFILE) {
        return await this.eidtHandler(ctx);
      }
    } else if (MessageValidator.isTextMessage(ctx)) {
      const session = await this.sessionManager.get(userId);

      if (!session?.handlerStatus) return;

      await this.eidtHandler(ctx);
    }
  }
}
