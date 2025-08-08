import { Markup } from 'telegraf';

export const startDialogKeyboard = (senderId) =>
  Markup.inlineKeyboard([
    Markup.button.callback('🗣 Запропонувати бесіду', `dialog:${senderId}`),
    Markup.button.callback('🙅‍♂️ Ігнорувати', `ignore:${senderId}`),
  ]);
