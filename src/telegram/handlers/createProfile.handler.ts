import { Injectable } from '@nestjs/common';
import { CreateProfileCommand } from '../commands/createProfile.command';
import { Context } from 'telegraf';
import { IHandlerStatus } from 'src/interfaces/handler-status.session.interface';
import { ProfileValidator } from 'src/validations/Profile.validator';
import { MessageValidator } from 'src/validations/message.validator';
import { HandlerSteps } from 'src/enums/handler-steps.enum';
import { SessionManager } from '../sessions/sessionManager.session';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';
import { IHandler } from 'src/interfaces/handler.interface';

@Injectable()
export class CreateProfileHandler implements IHandler {
  constructor(
    private readonly createProfileCommand: CreateProfileCommand,
    private readonly sessionManager: SessionManager<ISessionSchema>,
  ) {}

  async canHandle(ctx: Context) {
    await this.createProfileCommand.handle(ctx);
  }

  async handle(ctx: Context, userId: number): Promise<void | false> {
    console.log('PAPA');

    const session = this.sessionManager.get(userId);

    if (!session?.handlerStatus) return false;
    console.log('THIS SESSION HANGLER:', session.handlerStatus.step);

    if (ProfileValidator.isGeoLocation(ctx)) {
      if (session.handlerStatus.step == HandlerSteps.CREATE_PROFILE) {
        return await this.canHandle(ctx);
      }
    } else if (ProfileValidator.isPhoto(ctx)) {
      if (session.handlerStatus.step === HandlerSteps.CREATE_PROFILE) {
        return await this.canHandle(ctx);
      }
    } else if (MessageValidator.isTextMessage(ctx)) {
      await this.canHandle(ctx);
    }

    return false;
  }
}
