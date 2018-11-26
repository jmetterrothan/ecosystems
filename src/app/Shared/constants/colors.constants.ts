import { IColor } from './../models/color.model';
import { Color } from 'three';

export const DEFAULT_COLORS: IColor[] = [
  {
    stop: 0,
    color: new Color(0xfcd95f)
  }, {
    stop: 0.015,
    color: new Color(0xf0e68c)
  }, {
    stop: .075,
    color: new Color(0x93c54b)
  }, {
    stop: .125,
    color: new Color(0x62ad3e)
  }, {
    stop: .195,
    color: new Color(0x634739)
  }, {
    stop: 0.85,
    color: new Color(0xbcd4d9)
  }, {
    stop: 0.95,
    color: new Color(0xffffff)
  }
];
