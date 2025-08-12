import { Injectable } from '@nestjs/common';
import { MessageValidator } from 'src/validations/message.validator';
import { Context } from 'telegraf';
import { getUsersNearbyCommand } from '../commands/get-nearby-users.command';
import { SessionManager } from '../sessions/sessionManager.session';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';
import { HandlerSteps } from 'src/enums/handler-steps.enum';
import { IHandler } from 'src/interfaces/handler.interface';

@Injectable()
export class GetNearbyUsersHandler implements IHandler {
  constructor(
    private readonly getUsersNearbyCommand: getUsersNearbyCommand,
    private readonly sessionManager: SessionManager<ISessionSchema>,
  ) {}

  canHandle(ctx: Context) {
    return this.getUsersNearbyCommand.handler(ctx);
  }

  async handle(ctx: Context, userId: number) {
    const session = this.sessionManager.get(userId);
    if (!session) return false;

    if (MessageValidator.isTextMessage(ctx)) {
      if (session.handlerStatus?.step === HandlerSteps.GET_NEARBY_USERS) {
        await this.canHandle(ctx);
        return;
      }
    }
    return false;
  }
}
