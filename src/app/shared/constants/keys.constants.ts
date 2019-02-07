export enum MouseAction {
  LEFT_CLICK = 'left_click',
  RIGHT_CLICK = 'right_click',
  SCROLL = 'scroll',
}

export enum KeyAction {
  MOVE_DOWN = 'down',
  MOVE_UP = 'up',
  MOVE_RIGHT = 'right',
  MOVE_LEFT = 'left',
  MOVE_BACK = 'back',
  MOVE_FRONT = 'front',
  VOCAL = 'vocal',
  MUTE = 'mute',
  MENU = 'menu',
  RELOAD = 'reload',
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
