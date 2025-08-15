import { Injectable } from '@nestjs/common';
import { SessionManager } from '../../sessions/sessionManager.session';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';
import { Context, session } from 'telegraf';
import { UsersSearchService } from '../../services/users-search.service';
import { mainProfileKeyboard } from '../../keyboards/profile/mainProfile.keyboard';
import { SendMessageService } from '../../services/send-message.service';
import { MessageValidator } from 'src/validations/message.validator';
import { MessageForSend } from '../../BotAnswer/message.answer';
import { SessionSteps } from 'src/enums/session-steps.enum';
import { AnswerForUpdateLocation } from './location-asnwer.command';
import { ICommand } from 'src/interfaces/command.interface';
import { SendMessageSteps } from 'src/enums/SendMessage-steps.enum';

@Injectable()
export class SendMessageCommand implements ICommand {
  constructor(
    private readonly sessionManager: SessionManager<ISessionSchema>,
    private readonly answerForUpdateLocation: AnswerForUpdateLocation,
    private readonly sendMessageService: SendMessageService,
  ) {}

  async handle(ctx: Context) {
    const userId = ctx.chat?.id;
    if (!userId) return;

    const session = this.sessionManager.get(userId);
    if (!session) return;

    const users = await this.sendMessageService.sendMessageHandle(userId);
    if (typeof users === 'string') {
      ctx.reply(users);
      return;
    }
    if (MessageValidator.isTextMessage(ctx)) {
      if (session.sessionManager?.step === SendMessageSteps.GET_LOCATION) {
        await this.answerForUpdateLocation.handle(ctx);
        return;
      }
      ctx.reply(MessageForSend.start_send_message);
      this.sessionManager.start(userId, 'sessionManager', {
        step: SendMessageSteps.WAITING,
        data: {},
      });
      await this.answerForUpdateLocation.handle(ctx);
    }
  }
}
