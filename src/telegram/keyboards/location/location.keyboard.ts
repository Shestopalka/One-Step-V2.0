import { Markup } from 'telegraf';

export const locationKeyboard = Markup.keyboard([
  [
    {
      text: '📍 Надіслати геолокацію',
      request_location: true,
    },
  ],
])
  .resize()
  .oneTime();
