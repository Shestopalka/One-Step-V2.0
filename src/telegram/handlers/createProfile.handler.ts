import { Injectable } from '@nestjs/common';
import { CreateProfileCommand } from '../commands/createProfile.command';
import { Context } from 'telegraf';
import { IHandlerStatus } from 'src/interfaces/handler-status.session.interface';
import { ProfileValidator } from 'src/validations/Profile.validator';
import { MessageValidator } from 'src/validations/message.validator';
import { HandlerSteps } from 'src/enums/handler-steps.enum';
import { SessionManager } from '../sessions/sessionManager.session';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';

@Injectable()
export class CreateProfileHandler {
  constructor(
    private readonly createProfileCommand: CreateProfileCommand,
    private readonly sessionManager: SessionManager<ISessionSchema>,
  ) {}

  async createHandler(ctx: Context) {
    await this.createProfileCommand.handle(ctx);
  }

  async handler(ctx: Context, userId: number): Promise<false | void> {
    if (ProfileValidator.isGeoLocation(ctx)) {
      const session = this.sessionManager.get(userId);
      if (!session?.handlerStatus) return;

      if (session.handlerStatus.step == HandlerSteps.CREATE_PROFILE) {
        return await this.createHandler(ctx);
      }
    } else if (ProfileValidator.isPhoto(ctx)) {
      const session = this.sessionManager.get(userId);
      if (!session?.handlerStatus) return;

      if (session.handlerStatus.step === HandlerSteps.CREATE_PROFILE) {
        return await this.createHandler(ctx);
      }
    } else if (MessageValidator.isTextMessage(ctx)) {
      await this.createHandler(ctx);
    }
    return false;
  }
}
