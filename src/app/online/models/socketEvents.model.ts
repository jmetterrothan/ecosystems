export interface ISocketEvents {
  CL_SEND_JOIN_ROOM: string;
  SV_SEND_JOIN_ROOM: string;

  CL_SEND_PLAYER_POSITION: string;
  SV_SEND_PLAYER_POSITION: string;

  CL_SEND_ADD_OBJECT: string;
  SV_SEND_ADD_OBJECT: string;

  CL_SEND_REMOVE_OBJECT: string;
  SV_SEND_REMOVE_OBJECT: string;

  CL_SEND_MESSAGE: string;
  SV_SEND_MESSAGES: string;

  SV_SEND_DISCONNECTION: string;
}
