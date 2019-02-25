import { storageSvc } from '@shared/services/storage.service';
import { STORAGES_KEY } from '@achievements/constants/storageKey.constants';

export enum MouseAction {
  LEFT_CLICK = 'left_click',
  RIGHT_CLICK = 'right_click',
  SCROLL = 'scroll',
}

export enum KeyAction {
  FREEZE = 'freeze',
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
  CHAT = 'chat'
}

export const KeysTmp = {
  [KeyAction.FREEZE]: 'F',
  [KeyAction.MOVE_DOWN]: 'SHIFT',
  [KeyAction.MOVE_UP]: ' ',
  [KeyAction.MOVE_RIGHT]: 'D',
  [KeyAction.MOVE_LEFT]: 'Q',
  [KeyAction.MOVE_BACK]: 'S',
  [KeyAction.MOVE_FRONT]: 'Z',
  [KeyAction.VOCAL]: 'V',
  [KeyAction.MUTE]: 'M',
  [KeyAction.MENU]: 'ESCAPE',
  [KeyAction.RELOAD]: 'F5',
  [KeyAction.CHAT]: 'C'
};

export const Keys = storageSvc.get(STORAGES_KEY.keyboard) || Object.assign({}, KeysTmp);
