import { Inject, Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { IForwarder } from 'src/interfaces/forwarder.interface';

@Injectable()
export class MainForwarder {
  constructor(
    @Inject('FORWARDERS') private readonly forwarders: IForwarder[],
  ) {}

  async forward(ctx: Context, userId: number, text: string, step: string) {
    for (const forwarder of this.forwarders) {
      if (await forwarder.canForwarder(ctx, userId, text, step)) {
        break;
      }
    }
  }

  async handle(ctx: Context, userId: number, step: string) {
    for (const forwarder of this.forwarders) {
      if (await forwarder.forward(ctx, userId, step)) {
        break;
      }
    }
  }
}
