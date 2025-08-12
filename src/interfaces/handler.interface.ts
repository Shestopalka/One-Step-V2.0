import { Context } from 'telegraf';

export interface IHandler {
  canHandle(ctx: Context): Promise<any>;
  handle(ctx: Context, userId: number): Promise<false | void>;
}
