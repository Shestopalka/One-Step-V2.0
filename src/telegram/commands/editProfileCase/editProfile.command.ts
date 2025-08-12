import { Injectable } from '@nestjs/common';
import { MessageValidator } from 'src/validations/message.validator';
import { Context } from 'telegraf';
import { SessionManager } from 'src/telegram/sessions/sessionManager.session';
import { editProfileKeyboard } from '../../keyboards/profile/editProfile.keyboard';
import { ProfileTelegramPresenter } from '../../presenters/profile-telegram.presenter';
import { ChangeHandler } from './change-handler.command';
import { ProfileValidator } from 'src/validations/Profile.validator';
import { ISessionManager } from 'src/interfaces/session-manager.interface';
import { EditSessionSteps } from 'src/enums/EditSession-steps.enum';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';

@Injectable()
export class EditProfileCommand {
  constructor(
    private readonly sessionManager: SessionManager<ISessionSchema>,
    private readonly profileTelegramPresenter: ProfileTelegramPresenter,
    private readonly changeHandler: ChangeHandler,
  ) {}

  async handle(ctx: Context) {
    const userId = ctx.chat?.id;
    if (!userId) return;
    const session = this.sessionManager.get(userId);

    if (MessageValidator.isTextMessage(ctx)) {
      if (ctx.message.text === '✏️ Редагувати анкету') {
        this.sessionManager.start(userId, 'sessionManager', {
          step: EditSessionSteps.EDIT,
          data: {},
        });
        await ctx.reply(
          '🛠 Що саме хочеш оновити у своїй анкеті? Вибери опцію нижче 👇',
          editProfileKeyboard,
        );
      }
    }

    if (!session) return;

    await this.changeHandler.handlerRequest(userId, ctx);
  }
}
