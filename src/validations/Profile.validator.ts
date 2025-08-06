import { Injectable } from '@nestjs/common';

import { Context } from 'telegraf';

@Injectable()
export class ProfileValidator {
  constructor() {}

  static isPhoto(ctx: Context): ctx is Context & { message: { photo: any[] } } {
    return (
      !!ctx.message &&
      'photo' in ctx.message &&
      Array.isArray(ctx.message.photo)
    );
  }

  static getUserPhoto(photo: any): string | null {
    if (!Array.isArray(photo) || photo.length === 0) return null;

    const bestPhoto = photo[photo.length - 1];
    return bestPhoto?.file_id ?? null;
  }

  static isGeoLocation(ctx: Context): ctx is Context & {
    message: { location: { latitude: number; longitude: number } };
  } {
    return !!ctx.message && 'location' in ctx.message;
  }

  static validationName(name: string): true | string {
    if (name.length < 2) return "❌ Ім'я закоротке як на мене)";
    if (name.length > 25) return "❌ Ім'я велике як на мене)";

    if (/\s/.test(name)) return "❌ Вкажи ім'я без пробілів!";
    if (/\d/.test(name)) return '❌ В імені не можуть бути цифри)))';

    return true;
  }

  static validationAge(age: string): true | string {
    const testAge = parseInt(age);

    if (!testAge && testAge !== 0)
      return '❗ Будь ласка, введи вік лише цифрами, без тексту 😅';
    if (testAge <= 0) return '🤨 Щось не те з віком... Спробуй ще раз';
    if (testAge < 10) '😅 Тобо сюди. Біжи на уроки 👶';
    if (testAge > 100) return '❗ Не вірю 😅)';

    return true;
  }
}
