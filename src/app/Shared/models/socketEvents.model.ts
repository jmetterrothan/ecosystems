export interface ISocketRoomJoined {
  me: string;
  usersConnected: string[];
}

export interface ISocketPositionUpdated {
  userID: string;
  position: THREE.Vector3;
}
