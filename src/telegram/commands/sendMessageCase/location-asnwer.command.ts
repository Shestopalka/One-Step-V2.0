import { Injectable } from '@nestjs/common';
import { SessionSteps } from 'src/enums/session-steps.enum';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';
import { MessageForSend } from 'src/telegram/BotAnswer/message.answer';
import { answerEditLocationKeyboard } from 'src/telegram/keyboards/message/answerEditLocation.keyboard';
import { SessionManager } from 'src/telegram/sessions/sessionManager.session';
import { MessageValidator } from 'src/validations/message.validator';
import { Context } from 'telegraf';
import { UpdateLocationCommand } from '../update-location.command';
import { ProfileValidator } from 'src/validations/Profile.validator';
import { ProfileService } from 'src/telegram/services/profile.service';
import { locationKeyboard } from 'src/telegram/keyboards/location/location.keyboard';
import { targetKeyboard } from 'src/telegram/keyboards/message/target.keyboard';
import { MailingFilterCommand } from './mailing-filter.command';
import { SendMessageSteps } from 'src/enums/SendMessage-steps.enum';

@Injectable()
export class AnswerForUpdateLocation {
  constructor(
    private readonly sessionManager: SessionManager<ISessionSchema>,
    private readonly profileService: ProfileService,
    private readonly mailingFilterCommand: MailingFilterCommand,
  ) {}

  async handle(ctx: Context) {
    const userId = ctx.chat?.id;
    if (!userId) return;

    const session = this.sessionManager.get(userId);

    if (!session?.sessionManager) return;

    if (ProfileValidator.isGeoLocation(ctx)) {
      await this.profileService.updateLocationUser(
        userId,
        ctx.message.location,
      );
      ctx.reply(MessageForSend.update_location);
      this.sessionManager.update(userId, 'sessionManager', {
        step: SendMessageSteps.GET_GENDER,
      });
      ctx.reply(MessageForSend.answer_for_send_gender, targetKeyboard);
      await this.mailingFilterCommand.handle(ctx);
      return;
    }

    if (MessageValidator.isTextMessage(ctx)) {
      if (session.sessionManager.step === SendMessageSteps.WAITING) {
        ctx.reply(
          MessageForSend.answer_update_location,
          answerEditLocationKeyboard,
        );
        this.sessionManager.update(userId, 'sessionManager', {
          step: SendMessageSteps.GET_LOCATION,
        });
        return;
      }
      if (session.sessionManager.step === SendMessageSteps.GET_LOCATION) {
        if (ctx.message.text === '✅ Так') {
          this.sessionManager.update(userId, 'sessionManager', {
            step: SendMessageSteps.UPDATED_LOCATION,
          });
          ctx.reply(
            '👍 Чудово! Надішли свою геолокацію, щоб я міг знайти людей поруч',
            locationKeyboard,
          );
          return;
        } else if (ctx.message.text === '❌ Ні') {
          (ctx.reply(MessageForSend.not_update),
            this.sessionManager.update(userId, 'sessionManager', {
              step: SendMessageSteps.GET_GENDER,
            }));
          ctx.reply(MessageForSend.answer_for_send_gender, targetKeyboard);
          await this.mailingFilterCommand.handle(ctx);
          return;
        }
      } else if (
        session.sessionManager.step === SendMessageSteps.UPDATED_LOCATION
      ) {
        ctx.reply(MessageForSend.is_not_geo, answerEditLocationKeyboard);
        return;
      }
    }
  }
}
