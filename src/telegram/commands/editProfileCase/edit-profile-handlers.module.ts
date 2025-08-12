import { Module } from '@nestjs/common';
import { ChangeHandler } from './change-handler.command';
import { UpdateHandler } from './update-handler.command';
import { SessionModule } from 'src/telegram/modules/session.module';
import { ProfileModule } from 'src/telegram/modules/profile.module';
import { PresentersModule } from 'src/telegram/modules/presenters.module';

@Module({
  imports: [SessionModule, ProfileModule, PresentersModule],
  providers: [ChangeHandler, UpdateHandler],
  exports: [ChangeHandler, UpdateHandler],
})
export class SubsidiaryHandlerModule {}
