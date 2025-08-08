import { Module } from '@nestjs/common';
import { ProfileTelegramPresenter } from '../presenters/profile-telegram.presenter';
import { UserService } from '../services/user.service';
import { ProfileModule } from './profile.module';

@Module({
  imports: [ProfileModule],
  providers: [ProfileTelegramPresenter],
  exports: [ProfileTelegramPresenter],
})
export class PresentersModule {}
