import { Markup } from 'telegraf';

export const editProfileKeyboard = Markup.keyboard([
  ['📝 Імʼя', '🔞 Вік'],
  ['📸 Фото', '👩🧑 Стать'],
  ['⬅️ Назад'],
])
  .resize()
  .oneTime();
