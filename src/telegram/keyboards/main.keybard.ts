import { Markup } from 'telegraf';

export const mainKeyboard = Markup.keyboard([
  ['👤 Моя анкета'],
  ['📝 Створити анкету'],
  ['📍 Хто поруч?'],
])
  .resize()
  .oneTime();
