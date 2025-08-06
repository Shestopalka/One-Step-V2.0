import { SessionSteps } from 'src/enums/session-steps.enum';
import { ISessionData } from './session-data.interface';
import { EditSessionSteps } from 'src/enums/EditSession-steps.enum';

export interface ISessionManager {
  step: SessionSteps | EditSessionSteps;
  data: ISessionData;
}
export { ISessionData };
