import { Injectable } from '@nestjs/common';
import { MessageValidator } from 'src/validations/message.validator';
import { Context } from 'telegraf';
import { ProfileTelegramPresenter } from '../presenters/profile-telegram.presenter';
import { SessionManager } from '../sessions/sessionManager.session';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';

@Injectable()
export class GetProfileCommand {
  constructor(
    private readonly profileTelegramPresenter: ProfileTelegramPresenter,
    private readonly sessionManager: SessionManager<ISessionSchema>,
  ) {}

  async handler(ctx: Context) {
    const userId = ctx.chat?.id;
    if (!userId) return;

    if (MessageValidator.isTextMessage(ctx)) {
      ctx.reply('Шукаю анкету...');
      await this.profileTelegramPresenter.sendProfileForUser(userId, ctx);
      this.sessionManager.end(userId, 'handlerStatus');
    }
  }
}
