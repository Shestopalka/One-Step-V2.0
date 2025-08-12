import { Injectable } from '@nestjs/common';
import { IForwarder } from 'src/interfaces/forwarder.interface';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';
import { SessionManager } from 'src/telegram/sessions/sessionManager.session';
import { GetNearbyUsersHandler } from '../telegram/handlers/get-nearby-users.handler';
import { Context } from 'telegraf';
import { HandlerSteps } from 'src/enums/handler-steps.enum';
import { BotKeyboard } from 'src/enums/BotKeyboard.enum';

@Injectable()
export class GetNearbyUsersForwarder implements IForwarder {
  constructor(
    private readonly sessionManager: SessionManager<ISessionSchema>,
    private readonly getNearbyUsersHandler: GetNearbyUsersHandler,
  ) {}
  async canForwarder(
    ctx: Context,
    userId: number,
    text: string,
    step: string,
  ): Promise<false | void> {
    if (
      text === BotKeyboard.GET_NEARBY_USERS ||
      step === HandlerSteps.GET_NEARBY_USERS
    ) {
      this.sessionManager.update(userId, 'handlerStatus', {
        step: HandlerSteps.GET_NEARBY_USERS,
      });
      await this.getNearbyUsersHandler.handle(ctx, userId);
      return;
    }
    return false;
  }
  async forward(ctx: Context, userId: number, step: string): Promise<void> {
    if (step === HandlerSteps.GET_NEARBY_USERS) {
      await this.getNearbyUsersHandler.handle(ctx, userId);
    }
  }
}
