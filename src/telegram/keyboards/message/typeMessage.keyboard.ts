import { Markup } from 'telegraf';

export const typeMessageKeyboard = Markup.keyboard([
  ['🥷 Надіслати анонімно'],
  ['🗣 Надіслати публічно'],
  ['⬅️ Назад'],
])
  .resize()
  .oneTime();
