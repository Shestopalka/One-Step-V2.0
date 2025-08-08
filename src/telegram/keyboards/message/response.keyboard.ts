import { Markup } from 'telegraf';

export const responseKeyboard = (senderId) =>
  Markup.inlineKeyboard([
    Markup.button.callback('🙋🏼‍♂️ Відгукнутись', `respond:${senderId}`),
    Markup.button.callback('🙅‍♂️ Проігнорити', `ignoring:${senderId}`),
  ]);
