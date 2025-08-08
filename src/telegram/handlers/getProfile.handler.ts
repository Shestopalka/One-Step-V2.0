import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { SessionManager } from '../sessions/sessionManager.session';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';
import { MessageValidator } from 'src/validations/message.validator';
import { HandlerSteps } from 'src/enums/handler-steps.enum';
import { GetProfileCommand } from '../commands/getProfile.command';

@Injectable()
export class GetProfileHandler {
  constructor(
    private readonly sessionManager: SessionManager<ISessionSchema>,
    private readonly getProfileCommand: GetProfileCommand,
  ) {}

  getHandler(ctx: Context) {
    return this.getProfileCommand.handler(ctx);
  }

  handler(ctx: Context, userId: number) {
    const session = this.sessionManager.get(userId);

    if (!session?.handlerStatus) return;

    if (MessageValidator.isTextMessage(ctx)) {
      if (session.handlerStatus.step === HandlerSteps.GET_PROFILE) {
        return this.getHandler(ctx);
      }
    }
  }
}
