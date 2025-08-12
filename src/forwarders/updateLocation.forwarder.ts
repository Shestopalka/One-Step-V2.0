import { Injectable } from '@nestjs/common';
import { IForwarder } from 'src/interfaces/forwarder.interface';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';
import { SessionManager } from 'src/telegram/sessions/sessionManager.session';
import { UpdateLocationHandler } from '../telegram/handlers/updateLocation.handler';
import { Context } from 'telegraf';
import { HandlerSteps } from 'src/enums/handler-steps.enum';
import { BotKeyboard } from 'src/enums/BotKeyboard.enum';

@Injectable()
export class UpdateLocationForwarder implements IForwarder {
  constructor(
    private readonly sessionManager: SessionManager<ISessionSchema>,
    private readonly updateLocationHandler: UpdateLocationHandler,
  ) {}

  async canForwarder(
    ctx: Context,
    userId: number,
    text: string,
    step: string,
  ): Promise<false | void> {
    if (
      text === BotKeyboard.UPDATE_LOCATION ||
      step === HandlerSteps.UPDATE_LOCATION
    ) {
      this.sessionManager.update(userId, 'handlerStatus', {
        step: HandlerSteps.UPDATE_LOCATION,
      });
      await this.updateLocationHandler.handle(ctx, userId);
      return;
    }
    return false;
  }
  async forward(ctx: Context, userId: number, step: string): Promise<void> {
    if (step === HandlerSteps.UPDATE_LOCATION) {
      await this.updateLocationHandler.handle(ctx, userId);
    }
  }
}
