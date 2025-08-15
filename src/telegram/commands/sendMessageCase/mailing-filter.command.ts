import { Injectable } from '@nestjs/common';
import { SendMessageSteps } from 'src/enums/SendMessage-steps.enum';
import { SessionSteps } from 'src/enums/session-steps.enum';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';
import { MessageForSend } from 'src/telegram/BotAnswer/message.answer';
import { targetKeyboard } from 'src/telegram/keyboards/message/target.keyboard';
import { typeMessageKeyboard } from 'src/telegram/keyboards/message/typeMessage.keyboard';
import { mainProfileKeyboard } from 'src/telegram/keyboards/profile/mainProfile.keyboard';
import { SessionManager } from 'src/telegram/sessions/sessionManager.session';
import { MessageValidator } from 'src/validations/message.validator';
import { Context } from 'telegraf';
import { TypeMessageCommand } from './type-message.command';

@Injectable()
export class MailingFilterCommand {
  constructor(
    private readonly sessionManager: SessionManager<ISessionSchema>,
    private readonly typeMessageCommand: TypeMessageCommand,
  ) {}

  async handle(ctx: Context) {
    const userId = ctx.chat?.id;
    if (!userId) return;

    const session = this.sessionManager.get(userId);
    if (!session) return;

    if (session.sessionManager?.step === SessionSteps.GENDER) {
      const text = MessageValidator.isTextMessage(ctx)
        ? ctx.message.text
        : false;
      if (text === '⬅️ Назад') {
        await ctx.reply('🔙 Добре, повертаємось назад у головне меню.');
        await ctx.reply(
          '📋 Обери, будь ласка, дію з меню:',
          mainProfileKeyboard,
        );
        this.sessionManager.endAll(userId);
        return;
      }
      if (
        text !== '🧑 Тільки хлопці' &&
        text !== '👩Тільки дівчатка' &&
        text !== '🌍 Всі'
      ) {
        ctx.reply(
          '⚠️ Будь ласка, натисни одну з кнопок нижче, щоб обрати аудиторію',
          targetKeyboard,
        );
        return;
      }
      let dataTarget = '';
      if (text === '🧑 Тільки хлопці') {
        dataTarget = '1';
      } else if (text === '👩Тільки дівчатка') {
        dataTarget = '0';
      } else if (text === '🌍 Всі') {
        dataTarget = 'all';
      }
      this.sessionManager.update(userId, 'sessionManager', {
        step: SendMessageSteps.GET_TYPE,
        data: { dataTarget },
      });
      ctx.reply(MessageForSend.answer_for_type_message, typeMessageKeyboard);
      await this.typeMessageCommand.handle(ctx);
    }
  }
}
