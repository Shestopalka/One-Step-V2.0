import { Injectable } from '@nestjs/common';
import { genderKeyboard } from 'src/telegram/keyboards/profile/gender.keyboard';
import { SessionManager } from 'src/telegram/sessions/sessionManager.session';
import { MessageValidator } from 'src/validations/message.validator';
import { Context } from 'telegraf';
import { UpdateHandler } from './update-handler.command';
import { ProfileTelegramPresenter } from 'src/telegram/presenters/profile-telegram.presenter';
import { backKeyboard } from 'src/telegram/keyboards/profile/back.keybard';
import { EditSessionSteps } from 'src/enums/EditSession-steps.enum';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';

@Injectable()
export class ChangeHandler {
  constructor(
    private readonly sessionManager: SessionManager<ISessionSchema>,
    private readonly updateHandler: UpdateHandler,
    private readonly profileTelegramPresenter: ProfileTelegramPresenter,
  ) {}
  async handlerRequest(userId: number, ctx: Context): Promise<void> {
    const session = this.sessionManager.get(userId);
    if (!session) return;

    const state = session.sessionManager;
    const handler = session.handlerStatus;

    if (MessageValidator.isTextMessage(ctx)) {
      if (ctx.message.text === '⬅️ Назад') {
        this.sessionManager.end(userId, 'sessionManager');
        ctx.reply('🔥 Клас! Ось твоя оновлена анкета:');
        await this.profileTelegramPresenter.sendProfileForUser(userId, ctx);
        await this.sessionManager.end(userId, 'handlerStatus');
        return;
      }
      if (ctx.message.text === '🔞 Вік') {
        this.sessionManager.update(userId, 'sessionManager', {
          step: EditSessionSteps.AGE,
        });
        ctx.reply('Скільки тобі років зараз? 🔢 Вкажи новий вік цифрами');
        return;
      } else if (ctx.message.text === '📝 Імʼя') {
        this.sessionManager.update(userId, 'sessionManager', {
          step: EditSessionSteps.NAME,
        });
        ctx.reply(' Введи нове ім’я — як до тебе звертатися?');
        return;
      } else if (ctx.message.text === '📸 Фото') {
        this.sessionManager.update(userId, 'sessionManager', {
          step: EditSessionSteps.PHOTO,
        });

        ctx.reply(
          '📷 Надішли нове фото, яке зʼявиться у твоїй анкеті',
          backKeyboard,
        );
        return;
      } else if (ctx.message.text === '👩🧑 Стать') {
        this.sessionManager.update(userId, 'sessionManager', {
          step: EditSessionSteps.GENDER,
        });
        ctx.reply('👥 Обери, хто ти:', genderKeyboard);
        return;
      }
    }
    if (state?.step) {
      await this.updateHandler.updateHandler(ctx, userId, state?.step);
    }
    return;
  }
}
