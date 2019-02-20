import { IEnv } from '@shared/models/env.model';

export const PROD_ENV: IEnv = {
<<<<<<< develop
<<<<<<< develop
  socketBaseUrl: 'ws://ecosystem-server.herokuapp.com'
=======
  socketBaseUrl: 'wss://192.168.43.230/',
  socketPort: 32864
>>>>>>> fix: wss socket
=======
  socketBaseUrl: 'ws://192.168.43.230/',
  socketPort: 4200
>>>>>>> fix: prod env
};
