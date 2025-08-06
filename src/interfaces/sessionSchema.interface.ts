import { IHandlerStatus } from './handler-status.session.interface';
import { ISessionManager } from './session-manager.interface';

export interface ISessionSchema {
  handlerStatus?: IHandlerStatus;
  sessionManager?: ISessionManager;
}
