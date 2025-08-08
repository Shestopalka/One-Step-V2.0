import { Markup } from 'telegraf';

export const backKeyboard = Markup.keyboard([['⬅️ Назад']])
  .resize()
  .oneTime();
