import { Markup } from 'telegraf';

export const targetKeyboard = Markup.keyboard([
  ['🧑 Тільки хлопці', '👩Тільки дівчатка'],
  ['🌍 Всі'],
  ['⬅️ Назад'],
])
  .resize()
  .oneTime();
