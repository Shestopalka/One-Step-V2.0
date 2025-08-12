import { Injectable } from '@nestjs/common';
import { IForwarder } from 'src/interfaces/forwarder.interface';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';
import { SessionManager } from 'src/telegram/sessions/sessionManager.session';
import { Context } from 'telegraf';
import { CreateProfileHandler } from '../telegram/handlers/createProfile.handler';
import { HandlerSteps } from 'src/enums/handler-steps.enum';
import { BotKeyboard } from 'src/enums/BotKeyboard.enum';

@Injectable()
export class CreateProfileForwarder implements IForwarder {
  constructor(
    private readonly sessionManager: SessionManager<ISessionSchema>,
    private readonly createProfileHandler: CreateProfileHandler,
  ) {}
  async canForwarder(
    ctx: Context,
    userId: number,
    text: string,
    step: string,
  ): Promise<false | void> {
    if (text === BotKeyboard.CREATE || step === HandlerSteps.CREATE_PROFILE) {
      this.sessionManager.update(userId, 'handlerStatus', {
        step: HandlerSteps.CREATE_PROFILE,
      });
      await this.createProfileHandler.handle(ctx, userId);
      return;
    }
    return false;
  }
  async forward(ctx: Context, userId: number, step: string): Promise<void> {
    if (step === HandlerSteps.CREATE_PROFILE) {
      await this.createProfileHandler.handle(ctx, userId);
    }
  }
}
