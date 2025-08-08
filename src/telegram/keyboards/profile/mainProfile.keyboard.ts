import { Markup } from 'telegraf';

export const mainProfileKeyboard = Markup.keyboard([
  ['👤 Моя анкета', '✏️ Редагувати анкету'],
  ['💬 Написати комусь поруч', '📍 Оновити геолокацію'],
  ['🗺️ Показати, хто поруч'],
])
  .resize()
  .oneTime();
