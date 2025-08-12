import { Injectable } from '@nestjs/common';
import { SessionManager } from '../sessions/sessionManager.session';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';
import { Context } from 'telegraf';
import { MessageValidator } from 'src/validations/message.validator';
import { UsersSearchService } from '../services/users-search.service';
import { mainProfileKeyboard } from '../keyboards/profile/mainProfile.keyboard';

@Injectable()
export class getUsersNearbyCommand {
  constructor(
    private readonly sessionManager: SessionManager<ISessionSchema>,
    private readonly usersSearchService: UsersSearchService,
  ) {}

  async handler(ctx: Context) {
    const userId = ctx.chat?.id;
    if (!userId) return;

    if (MessageValidator.isTextMessage(ctx)) {
      ctx.reply('Круто! Здійснюю пошук людей біля тебе');
      setTimeout(() => {
        ctx.reply('Діапазон пошуку 2 кілометра!');
      }, 300);
      const users = await this.usersSearchService.findNearbyUsers(userId);
      console.log('THIS USERS!', users);

      if (!users || users?.length == 0) {
        setTimeout(() => {
          ctx.reply(
            'Шкода, але поруч з тобою я нікого не знайшов ):',
            mainProfileKeyboard,
          );
        }, 600);
        this.sessionManager.endAll(userId);
        return;
      }
      setTimeout(() => {
        ctx.reply(
          `Знайшов поруч з тобою ${users?.length} людей, хучіш пробуй з кимось познайомитись!`,
          mainProfileKeyboard,
        );
        this.sessionManager.endAll(userId);
        return;
      }, 600);
    }
  }
}
