import { Injectable } from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import { profileKeyboard } from '../keyboards/profile/profile.keyboard';
import { Context } from 'vm';
import { editProfileKeyboard } from '../keyboards/profile/editProfile.keyboard';
import { mainKeyboard } from '../keyboards/main.keybard';

@Injectable()
export class ProfileTelegramPresenter {
  constructor(private readonly profileService: ProfileService) {}

  async sendProfileForUser(telegram_id: number, ctx: Context): Promise<void> {
    const userProfile = await this.profileService.getProfile(telegram_id);
    if (!userProfile) {
      await ctx.reply('Анкета не знайдена', mainKeyboard);
      return;
    }

    const message = `
👤 Ім'я: ${userProfile.first_name || 'Відсутнє'}
🔞 Вік: ${userProfile.age || 'Відсутній'}
    `;

    await ctx.replyWithPhoto(userProfile.photo_file_id, {
      caption: message,
      reply_markup: profileKeyboard.reply_markup,
    });
  }

  async returnBack(ctx: Context, userId: number): Promise<void> {
    await ctx.reply('🔥 Клас! Ось твоя анкета:', editProfileKeyboard);
    await this.sendProfileForUser(userId, ctx);
    return;
  }
}
