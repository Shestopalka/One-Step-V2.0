import { Injectable } from '@nestjs/common';
import { ProfileValidator } from 'src/validations/Profile.validator';
import { Context } from 'telegraf';
import { SessionManager } from '../sessions/sessionManager.session';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';
import { HandlerSteps } from 'src/enums/handler-steps.enum';
import { UpdateLocationCommand } from '../commands/update-location.command';
import { MessageValidator } from 'src/validations/message.validator';
import { IHandler } from 'src/interfaces/handler.interface';

@Injectable()
export class UpdateLocationHandler implements IHandler {
  constructor(
    private readonly sessionManager: SessionManager<ISessionSchema>,
    private readonly updateLocationCommand: UpdateLocationCommand,
  ) {}

  async canHandle(ctx: Context) {
    return this.updateLocationCommand.handler(ctx);
  }

  async handle(ctx: Context, userId: number) {
    const session = this.sessionManager.get(userId);
    if (!session?.handlerStatus) return false;

    if (ProfileValidator.isGeoLocation(ctx)) {
      await this.canHandle(ctx);
      return;
    } else if (MessageValidator.isTextMessage(ctx)) {
      if (session.handlerStatus.step === HandlerSteps.UPDATE_LOCATION) {
        this.canHandle(ctx);
        return;
      }
    }
    return false;
  }
}
