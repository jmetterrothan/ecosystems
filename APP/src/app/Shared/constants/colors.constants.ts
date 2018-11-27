import { IColor } from './../models/color.model';
import { Color } from 'three';

export const DEFAULT_COLORS: IColor[] = [
  {
    stop: 0,
    color: new Color(0xfcd95f) // underwater sand
  }, {
    stop: 0.015,
    color: new Color(0xf0e68c) // sand
  }, {
    stop: .04,
    color: new Color(0x93c54b) // grass
  }, {
    stop: .06,
    color: new Color(0x62ad3e) // dark grass
  }, {
    stop: .14,
    color: new Color(0x4d382c) // dark rock
  }, {
    stop: 0.385,
    color: new Color(0x634739) // rock
  }, {
    stop: 1.25,
    color: new Color(0xffffff) // snow cap
  }
];
