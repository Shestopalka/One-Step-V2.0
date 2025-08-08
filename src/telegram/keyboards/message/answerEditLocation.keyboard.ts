import { Markup } from 'telegraf';

export const answerEditLocationKeyboard = Markup.keyboard([
  ['✅ Так'],
  ['❌ Ні'],
  ['⬅️ Назад'],
])
  .resize()
  .oneTime();
