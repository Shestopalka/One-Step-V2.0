import { Markup } from 'telegraf';

export const genderKeyboard = Markup.keyboard([
  ['🧑 Я хлопець', '👩 Я дівчина'],
])
  .resize()
  .oneTime();
