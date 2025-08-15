import { Module } from '@nestjs/common';
import { AnswerForUpdateLocation } from './location-asnwer.command';
import { SendMessageCommand } from './send-message.command';
import { SessionModule } from 'src/telegram/modules/session.module';
import { ProfileModule } from 'src/telegram/modules/profile.module';
import { SendMessageModule } from 'src/telegram/modules/send-message.module';
import { UsersSearchModule } from 'src/telegram/modules/user-search.module';
import { MailingFilterCommand } from './mailing-filter.command';

@Module({
  imports: [SessionModule, ProfileModule, SendMessageModule, UsersSearchModule],
  providers: [
    AnswerForUpdateLocation,
    SendMessageCommand,
    MailingFilterCommand,
  ],
  exports: [AnswerForUpdateLocation, SendMessageCommand, MailingFilterCommand],
})
export class SubsidiarySendMessageModule {}
