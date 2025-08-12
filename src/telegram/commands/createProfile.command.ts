import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { MessageValidator } from '../../validations/message.validator';
import { ProfileValidator } from 'src/validations/Profile.validator';
import { genderKeyboard } from '../keyboards/profile/gender.keyboard';
import { locationKeyboard } from '../keyboards/location/location.keyboard';
import { ProfileService } from '../services/profile.service';
import { ISessionData } from 'src/interfaces/session-data.interface';
import { profileKeyboard } from '../keyboards/profile/profile.keyboard';
import { SessionSteps } from 'src/enums/session-steps.enum';
import { SessionManager } from '../sessions/sessionManager.session';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';
import { BotKeyboard } from 'src/enums/BotKeyboard.enum';
import { MessageForCreateProfile } from '../BotAnswer/message.answer';
import { ProfileTelegramPresenter } from '../presenters/profile-telegram.presenter';

@Injectable()
export class CreateProfileCommand {
  constructor(
    private readonly sessionManager: SessionManager<ISessionSchema>,
    private readonly profileService: ProfileService,
    private readonly profileTelegramPresenter: ProfileTelegramPresenter,
  ) {}
  async handle(ctx: Context) {
    const userId = ctx.chat?.id;
    if (!userId) return;

    const session = this.sessionManager.get(userId);
    const isSession = this.sessionManager.has(userId);
    const state = session?.sessionManager;
    const handler = session?.handlerStatus;
    console.log('This isSession:', isSession);

    if (!ctx.message) return;

    if (
      state?.step === SessionSteps.LOCATION &&
      !ProfileValidator.isGeoLocation(ctx)
    ) {
      ctx.reply(MessageForCreateProfile.is_not_geo);
      return;
    } else if (
      state?.step === SessionSteps.PHOTO &&
      !ProfileValidator.isPhoto(ctx)
    ) {
      ctx.reply(MessageForCreateProfile.is_not_photo);
    }
    if (
      state?.step === SessionSteps.LOCATION &&
      ProfileValidator.isGeoLocation(ctx)
    ) {
      const { latitude, longitude } = ctx.message.location;
      console.log('Location received:', latitude, longitude);

      this.sessionManager.update(userId, 'sessionManager', {
        step: SessionSteps.PHOTO,
        data: {
          ...state.data,
          location: { type: 'Point', coordinates: [longitude, latitude] },
        },
      });
      await ctx.reply(MessageForCreateProfile.location_saved);
      setTimeout(async () => {
        await ctx.reply(MessageForCreateProfile.send_photo);
      }, 500);
      return;
    }
    if (ProfileValidator.isPhoto(ctx)) {
      let data: ISessionData | null = null;

      if (state?.step === SessionSteps.PHOTO) {
        console.log('Photo received:', ctx.message.photo);

        const file_id = ProfileValidator.getUserPhoto(ctx.message.photo);
        if (!file_id) {
          return await ctx.reply(MessageForCreateProfile.is_not_photo);
        }

        data = {
          ...state.data,
          photo_file_id: file_id,
        };
        console.log('This data:', data);

        const profile = await this.profileService.createProfile({
          ...data,
          telegram_id: userId,
        });
        console.log('This successfuly created profileUser:', profile);

        await ctx.reply(MessageForCreateProfile.saved_photo);
        const userProfile = await this.profileService.getProfile(userId);
        if (!userProfile) return;

        await ctx.reply(MessageForCreateProfile.get_profile);
        await this.profileTelegramPresenter.sendProfileForUser(userId, ctx);
        await ctx.reply(MessageForCreateProfile.profile_creating);
        await this.sessionManager.endAll(userId);
        return;
      }
    }

    if (MessageValidator.isTextMessage(ctx)) {
      const text = ctx.message.text;

      if (text === BotKeyboard.CREATE && !session?.sessionManager) {
        this.sessionManager.start(userId, 'sessionManager', {
          step: SessionSteps.SELECT,
          data: {},
        });
        await ctx.reply(MessageForCreateProfile.send_name);
        return;
      }

      if (!session?.sessionManager) return;
      console.log(
        'This session FROM CREATE PROFILE COMMAND:',
        session.sessionManager.step,
      );

      if (session.sessionManager.step === SessionSteps.SELECT) {
        const validName = ProfileValidator.validationName(text);
        if (typeof validName === 'string') {
          ctx.reply(validName);
          return;
        }
        console.log('12345');

        this.sessionManager.update(userId, 'sessionManager', {
          step: SessionSteps.AGE,
          data: { ...session.sessionManager.data, first_name: text },
        });

        await ctx.reply(MessageForCreateProfile.saved_name);
        setTimeout(() => {
          ctx.reply(MessageForCreateProfile.send_age);
        }, 500);
      } else if (session.sessionManager.step === SessionSteps.AGE) {
        const validAge = ProfileValidator.validationAge(text);
        if (typeof validAge === 'string') {
          ctx.reply(validAge);
          return;
        }

        this.sessionManager.update(userId, 'sessionManager', {
          step: SessionSteps.GENDER,
          data: { ...session.sessionManager.data, age: text },
        });

        await ctx.reply(MessageForCreateProfile.saved_age);
        await ctx.reply(MessageForCreateProfile.send_gender, genderKeyboard);
      } else if (session.sessionManager.step === SessionSteps.GENDER) {
        if (text !== BotKeyboard.MAN && text !== BotKeyboard.WOMAN) {
          return await ctx.reply(
            MessageForCreateProfile.is_not_gender,
            genderKeyboard,
          );
        }

        const userGender = text === BotKeyboard.MAN ? '1' : '0';
        this.sessionManager.update(userId, 'sessionManager', {
          step: SessionSteps.LOCATION,
          data: { ...session.sessionManager.data, gender: userGender },
        });

        await ctx.reply(MessageForCreateProfile.saved_gender);
        setTimeout(() => {
          ctx.reply(MessageForCreateProfile.send_geo, locationKeyboard);
        }, 500);
      }
    }
  }
}
