import { Injectable } from '@nestjs/common';
import { SendMessageSteps } from 'src/enums/SendMessage-steps.enum';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';
import { MessageForSend } from 'src/telegram/BotAnswer/message.answer';
import { backKeyboard } from 'src/telegram/keyboards/profile/back.keybard';
import { SessionManager } from 'src/telegram/sessions/sessionManager.session';
import { MessageValidator } from 'src/validations/message.validator';
import { Context } from 'telegraf';

@Injectable()
export class TypeMessageCommand {
  constructor(
    private readonly sessionManager: SessionManager<ISessionSchema>,
  ) {}

  async handle(ctx: Context) {
    const userId = ctx.chat?.id;
    if (!userId) return;

    const session = this.sessionManager.get(userId);
    if (!session) return;

    const text = MessageValidator.isTextMessage(ctx)
      ? ctx.message?.text
      : false;
    if (text === '🗣 Надіслати публічно') {
      ctx.reply(MessageForSend.warning_for_public_message, backKeyboard);
      this.sessionManager.update(userId, 'sessionManager', {
        step: SendMessageSteps.SEND_MESSAGE,
        data: { typeMessage: 'public' },
      });
    } else if (text === '🥷 Надіслати анонімно') {
      this.sessionManager.update(userId, 'sessionManager', {
        step: SendMessageSteps.SEND_MESSAGE,
        data: { typeMessage: 'private' },
      });
    }
  }
}
