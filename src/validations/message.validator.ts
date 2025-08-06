import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';

@Injectable()
export class MessageValidator {
  static isTextMessage(
    ctx: Context,
  ): ctx is Context & { message: { text: string } } {
    return (
      !!ctx.message &&
      'text' in ctx.message &&
      typeof ctx.message.text === 'string'
    );
  }

  static getText(ctx: Context): string | null {
    if (this.isTextMessage(ctx)) {
      return ctx.message.text;
    }
    return null;
  }
}
