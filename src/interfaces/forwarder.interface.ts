import { Context } from 'telegraf';

export interface IForwarder {
  canForwarder(
    ctx: Context,
    userId: number,
    text: string,
    step: string,
  ): Promise<false | void>;
  forward(ctx: Context, userId: number, step: string): Promise<void | false>;
}
