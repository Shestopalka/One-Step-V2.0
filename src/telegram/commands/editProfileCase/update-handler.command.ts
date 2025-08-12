import { Injectable } from '@nestjs/common';
import { EditSessionSteps } from 'src/enums/EditSession-steps.enum';
import { ISessionData } from 'src/interfaces/session-data.interface';
import { ISessionManager } from 'src/interfaces/session-manager.interface';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';
import { editProfileKeyboard } from 'src/telegram/keyboards/profile/editProfile.keyboard';
import { genderKeyboard } from 'src/telegram/keyboards/profile/gender.keyboard';
import { ProfileTelegramPresenter } from 'src/telegram/presenters/profile-telegram.presenter';
import { ProfileService } from 'src/telegram/services/profile.service';
import { SessionManager } from 'src/telegram/sessions/sessionManager.session';
import { MessageValidator } from 'src/validations/message.validator';
import { ProfileValidator } from 'src/validations/Profile.validator';
import { Context } from 'telegraf';

@Injectable()
export class UpdateHandler {
  constructor(
    private readonly sessionManager: SessionManager<ISessionSchema>,
    private readonly profileService: ProfileService,
    private readonly profileTelegramPresenters: ProfileTelegramPresenter,
  ) {}

  async updateHandler(ctx: Context, userId: number, step: string) {
    if (ProfileValidator.isPhoto(ctx)) {
      console.log('This ctx message is Photo === true');

      if (step === EditSessionSteps.PHOTO) {
        if (
          MessageValidator.isTextMessage(ctx) &&
          ctx.message.text === '⬅️ Назад'
        ) {
          this.sessionManager.endAll(userId);
          await this.profileTelegramPresenters.returnBack(ctx, userId);
          return;
        }
        const file_id = ProfileValidator.getUserPhoto(ctx.message.photo);
        if (!file_id) {
          ctx.reply('Будь ласка, надішли фото!');
          return;
        }
        await this.profileService.updateProfileUser(
          userId,
          'photo_file_id',
          file_id,
        );
        this.sessionManager.update(userId, 'sessionManager', {
          step: EditSessionSteps.EDIT,
        });
        ctx.reply(
          '📸 Фото оновлено! Тепер ти виглядаєш ще крутіше!',
          editProfileKeyboard,
        );
        return;
      }
    }

    if (MessageValidator.isTextMessage(ctx)) {
      if (step === EditSessionSteps.AGE) {
        if (ctx.message.text === '⬅️ Назад') {
          this.sessionManager.endAll(userId);
          await this.profileTelegramPresenters.returnBack(ctx, userId);
        }
        const result = await ProfileValidator.validationAge(ctx.message.text);
        if (typeof result === 'string') {
          ctx.reply(result, editProfileKeyboard);
          return;
        }
        await this.profileService.updateProfileUser(
          userId,
          'age',
          ctx.message.text,
        );
        await this.sessionManager.update(userId, 'sessionManager', {
          step: EditSessionSteps.EDIT,
        });
        await ctx.reply('Готово!, вік успішно змінено', editProfileKeyboard);
        return;
      } else if (step === EditSessionSteps.NAME) {
        if (ctx.message.text === '⬅️ Назад') {
          this.sessionManager.update(userId, 'sessionManager', {
            step: EditSessionSteps.EDIT,
          });
          await this.profileTelegramPresenters.returnBack(ctx, userId);
          return;
        }
        const result = await ProfileValidator.validationName(ctx.message.text);
        if (typeof result === 'string') {
          ctx.reply(result, editProfileKeyboard);
          return;
        }
        await this.profileService.updateProfileUser(
          userId,
          'first_name',
          ctx.message.text,
        );
        this.sessionManager.update(userId, 'sessionManager', {
          step: EditSessionSteps.EDIT,
        });

        await ctx.reply(
          'Говото! твоє імя успшно змінено!',
          editProfileKeyboard,
        );
        return;
      } else if (step === EditSessionSteps.GENDER) {
        if (ctx.message.text === '⬅️ Назад') {
          this.sessionManager.endAll(userId);
          await this.profileTelegramPresenters.returnBack(ctx, userId);
          return;
        }
        if (
          ctx.message.text !== '🧑 Я хлопець' &&
          ctx.message.text !== '👩 Я дівчина'
        ) {
          ctx.reply(
            '⚠️ Будьласка 🙏, обери ваніант натиснувши одну із кнопок нижче',
            genderKeyboard,
          );
          return;
        }
        const gender = ctx.message.text === '🧑 Я хлопець' ? '1' : '0';
        await this.profileService.updateProfileUser(userId, 'gender', gender);
        this.sessionManager.update(userId, 'sessionManager', {
          step: EditSessionSteps.EDIT,
        });

        await ctx.reply(
          'Готово! можеш переглянути анкету',
          editProfileKeyboard,
        );
        return;
      }
    }
  }
}
