import { Injectable } from '@nestjs/common';
import { IForwarder } from 'src/interfaces/forwarder.interface';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';
import { SessionManager } from 'src/telegram/sessions/sessionManager.session';
import { editProfileHandler } from '../telegram/handlers/editProfile.handler';
import { Context } from 'telegraf';
import { HandlerSteps } from 'src/enums/handler-steps.enum';
import { BotKeyboard } from 'src/enums/BotKeyboard.enum';

@Injectable()
export class EditProfileForwarder implements IForwarder {
  constructor(
    private readonly sessionManager: SessionManager<ISessionSchema>,
    private readonly editProfileHandler: editProfileHandler,
  ) {}

  async canForwarder(
    ctx: Context,
    userId: number,
    text: string,
    step: string,
  ): Promise<false | void> {
    if (
      text === BotKeyboard.EDIT_PROFILE ||
      step === HandlerSteps.EDIT_PROFILE
    ) {
      this.sessionManager.update(userId, 'handlerStatus', {
        step: HandlerSteps.EDIT_PROFILE,
      });
      await this.editProfileHandler.handle(ctx, userId);
      return;
    }
    return false;
  }
  async forward(ctx: Context, userId: number, step: string): Promise<void> {
    if (step === HandlerSteps.EDIT_PROFILE) {
      await this.editProfileHandler.handle(ctx, userId);
    }
  }
}
