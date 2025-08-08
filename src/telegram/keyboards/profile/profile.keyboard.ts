import { Markup } from 'telegraf';

export const profileKeyboard = Markup.keyboard([
  ['✏️ Редагувати анкету'],
  ['💬 Написати комусь поруч', '📍 Оновити геолокацію'],
  ['🗺️ Показати, хто поруч'],
])
  .resize()
  .oneTime();
