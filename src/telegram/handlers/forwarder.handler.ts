import { Injectable } from '@nestjs/common';
import { SessionManager } from '../sessions/sessionManager.session';
import { CreateProfileHandler } from './createProfile.handler';
import { Context } from 'telegraf';
import { editProfileHandler } from './editProfile.handler';
import { HandlerSteps } from 'src/enums/handler-steps.enum';
import { IHandlerStatus } from 'src/interfaces/handler-status.session.interface';
import { ISessionSchema } from 'src/interfaces/sessionSchema.interface';
import { UpdateLocationHandler } from './updateLocation.handler';
import { GetProfileHandler } from './getProfile.handler';
import { GetNearbyUsersHandler } from './get-nearby-users.handler';

@Injectable()
export class ForwarderHandler {
  constructor(
    private readonly createProfileHandler: CreateProfileHandler,
    private readonly updateLocationHandler: UpdateLocationHandler,
    private readonly sessionManager: SessionManager<ISessionSchema>,
    private readonly editProfileHandler: editProfileHandler,
    private readonly getProfileHandler: GetProfileHandler,
    private readonly getNearbyUsersHandler: GetNearbyUsersHandler,
  ) {}

  async forwarder(ctx: Context, userId: number, text: string, step: string) {
    if (text === '📝 Створити анкету' || step === HandlerSteps.CREATE_PROFILE) {
      this.sessionManager.update(userId, 'handlerStatus', {
        step: HandlerSteps.CREATE_PROFILE,
      });
      await this.createProfileHandler.handler(ctx, userId);
    } else if (
      text === '✏️ Редагувати анкету' ||
      step === HandlerSteps.EDIT_PROFILE
    ) {
      this.sessionManager.update(userId, 'handlerStatus', {
        step: HandlerSteps.EDIT_PROFILE,
      });
      await this.editProfileHandler.handler(ctx, userId);
    } else if (
      text === '📍 Оновити геолокацію' ||
      step === HandlerSteps.UPDATE_LOCATION
    ) {
      this.sessionManager.update(userId, 'handlerStatus', {
        step: HandlerSteps.UPDATE_LOCATION,
      });
      await this.updateLocationHandler.handler(ctx, userId);
    } else if (text === '👤 Моя анкета' || step === HandlerSteps.GET_PROFILE) {
      this.sessionManager.update(userId, 'handlerStatus', {
        step: HandlerSteps.GET_PROFILE,
      });
      await this.getProfileHandler.handler(ctx, userId);
    } else if (
      text === '🗺️ Показати, хто поруч' ||
      step === HandlerSteps.GET_NEARBY_USERS
    ) {
      this.sessionManager.update(userId, 'handlerStatus', {
        step: HandlerSteps.GET_NEARBY_USERS,
      });
      await this.getNearbyUsersHandler.handler(ctx, userId);
    }
  }

  async handler(ctx: Context, userId: number, step: string) {
    if (step == HandlerSteps.CREATE_PROFILE) {
      await this.createProfileHandler.handler(ctx, userId);
    } else if (step === HandlerSteps.EDIT_PROFILE) {
      await this.editProfileHandler.handler(ctx, userId);
    } else if (step === HandlerSteps.UPDATE_LOCATION) {
      await this.updateLocationHandler.handler(ctx, userId);
    }
  }
}
