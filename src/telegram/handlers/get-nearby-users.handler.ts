import { Injectable } from '@nestjs/common';
import { MessageValidator } from 'src/validations/message.validator';
import { Context } from 'telegraf';
import { getUsersNearbyCommand } from '../commands/get-nearby-users.command';
import { SessionManager } from '../sessions/sessionManager.session';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';
import { HandlerSteps } from 'src/enums/handler-steps.enum';

@Injectable()
export class GetNearbyUsersHandler {
  constructor(
    private readonly getUsersNearbyCommand: getUsersNearbyCommand,
    private readonly sessionManager: SessionManager<ISessionSchema>,
  ) {}

  nearbyHandler(ctx: Context) {
    return this.getUsersNearbyCommand.handler(ctx);
  }

  handler(ctx: Context, userId: number) {
    const session = this.sessionManager.get(userId);
    if (!session) return;

    if (MessageValidator.isTextMessage(ctx)) {
      if (session.handlerStatus?.step === HandlerSteps.GET_NEARBY_USERS) {
        return this.nearbyHandler(ctx);
      }
    }
  }
}
