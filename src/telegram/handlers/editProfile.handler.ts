import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { EditProfileCommand } from '../commands/editProfileCase/editProfile.command';
import { ProfileValidator } from 'src/validations/Profile.validator';
import { MessageValidator } from 'src/validations/message.validator';
import { HandlerSteps } from 'src/enums/handler-steps.enum';
import { SessionManager } from '../sessions/sessionManager.session';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';
import { IHandler } from 'src/interfaces/handler.interface';

@Injectable()
export class editProfileHandler implements IHandler {
  constructor(
    private readonly editProfileCommand: EditProfileCommand,
    private readonly sessionManager: SessionManager<ISessionSchema>,
  ) {}

  async canHandle(ctx: Context) {
    await this.editProfileCommand.handle(ctx);
  }

  async handle(ctx: Context, userId: number) {
    const session = this.sessionManager.get(userId);
    if (!session?.handlerStatus) return false;

    if (ProfileValidator.isGeoLocation(ctx)) {
      if (session.handlerStatus.step === HandlerSteps.EDIT_PROFILE) {
        return await this.canHandle(ctx);
      }
    } else if (ProfileValidator.isPhoto(ctx)) {
      if (session.handlerStatus.step === HandlerSteps.EDIT_PROFILE) {
        return await this.canHandle(ctx);
      }
    } else if (MessageValidator.isTextMessage(ctx)) {
      if (session?.handlerStatus.step === HandlerSteps.EDIT_PROFILE) {
        await this.canHandle(ctx);
      }
    }
    console.log('ABEMA');

    return false;
  }
}
