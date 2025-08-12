import { Injectable } from '@nestjs/common';
import { SessionManager } from '../sessions/sessionManager.session';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';
import { SendMessageCommand } from '../commands/sendMessageCase/send-message.command';
import { Context } from 'telegraf';
import { MessageValidator } from 'src/validations/message.validator';
import { HandlerSteps } from 'src/enums/handler-steps.enum';
import { IHandler } from 'src/interfaces/handler.interface';

@Injectable()
export class SendMessageHandler implements IHandler {
  constructor(
    private readonly sessionManager: SessionManager<ISessionSchema>,
    private readonly sendMessageCommand: SendMessageCommand,
  ) {}

  async canHandle(ctx: Context) {
    return await this.sendMessageCommand.handler(ctx);
  }

  async handle(ctx: Context, userId: number) {
    const session = this.sessionManager.get(userId);
    if (!session) return false;

    if (MessageValidator.isTextMessage(ctx)) {
      if (session.handlerStatus?.step === HandlerSteps.SEND_MESSAGE) {
        await this.canHandle(ctx);
        return;
      }
    }
    return false;
  }
}
