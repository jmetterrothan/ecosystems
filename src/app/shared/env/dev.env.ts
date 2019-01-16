import { IEnv } from '@shared/models/env.model';

export const DEV_ENV: IEnv = {
  socketBaseUrl: 'ws://localhost',
  socketPort: 4200
  /*   socketBaseUrl: 'wss://ecosystem-server.herokuapp.com/',
    socketPort: 32864 */
};
