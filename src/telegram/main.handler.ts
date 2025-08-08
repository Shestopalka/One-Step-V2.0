import { StartCommand } from './commands/start.command';
import { Context } from 'telegraf';
import { Command, Ctx, On, Update } from 'nestjs-telegraf';
import { SessionManager } from './sessions/sessionManager.session';
import { MessageValidator } from 'src/validations/message.validator';
import { ForwarderHandler } from './handlers/forwarder.handler';
import { HandlerSteps } from 'src/enums/handler-steps.enum';
import { IHandlerStatus } from 'src/interfaces/handler-status.session.interface';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';

@Update()
export class MainHandler {
  constructor(
    private readonly startCommand: StartCommand,
    private readonly sessionManager: SessionManager<ISessionSchema>,
    private readonly forwarderHandler: ForwarderHandler,
  ) {}

  @Command('start')
  async handleStart(@Ctx() ctx: Context) {
    await this.startCommand.handle(ctx);
  }

  @On('message')
  async handle(@Ctx() ctx: Context) {
    const userId = ctx.from?.id;
    if (!userId) return;
    console.log('This userId:', userId);
    const session = this.sessionManager.get(userId);
    console.log(session?.handlerStatus?.step);

    if (!session) {
      console.log('Session not found!');
      await this.sessionManager.start(userId, 'handlerStatus', {
        step: HandlerSteps.WAITING,
      });
    }

    if (MessageValidator.isTextMessage(ctx)) {
      const text = ctx.message.text;
      const session = this.sessionManager.get(userId);
      if (!session?.handlerStatus) return;
      await this.forwarderHandler.forwarder(
        ctx,
        userId,
        text,
        session.handlerStatus.step,
      );
    } else {
      const session = this.sessionManager.get(userId);
      if (!session?.handlerStatus) return;

      await this.forwarderHandler.handler(
        ctx,
        userId,
        session.handlerStatus.step,
      );
    }
  }
}
