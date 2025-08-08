import { Module } from '@nestjs/common';
import { SessionManager } from '../sessions/sessionManager.session';

@Module({
  imports: [],
  providers: [SessionManager],
  exports: [SessionManager],
})
export class SessionModule {}
