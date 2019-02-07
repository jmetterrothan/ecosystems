export enum KeyAction {
  MOVE_DOWN,
  MOVE_UP,
  MOVE_RIGHT,
  MOVE_LEFT,
  MOVE_BACK,
  MOVE_FRONT,
  VOCAL,
  MUTE,
  MENU,
  RELOAD,
}

export const Keys = {
  [KeyAction.MOVE_DOWN]: 'e',
  [KeyAction.MOVE_UP]: 'a',
  [KeyAction.MOVE_RIGHT]: 'd',
  [KeyAction.MOVE_LEFT]: 'q',
  [KeyAction.MOVE_BACK]: 's',
  [KeyAction.MOVE_FRONT]: 'z',
  [KeyAction.VOCAL]: 'v',
  [KeyAction.MUTE]: 'm',
  [KeyAction.MENU]: 'Escape',
  [KeyAction.RELOAD]: 'F5',
};
