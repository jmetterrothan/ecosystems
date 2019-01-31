import { Observable, Subject } from 'rxjs';
import { Howler } from 'howler';
import { GraphicsQuality } from '@shared/enums/graphicsQuality.enum';

import { CONFIGS } from '@shared/constants/config.constants';
import { IConfig } from '@shared/models/graphicsConfig.model';

import CommonUtils from '@shared/utils/Common.utils';

class ConfigService {
  public soundEnabled$: Subject<boolean>;
  public voiceEnabled$: Subject<boolean>;

  private q: GraphicsQuality = GraphicsQuality.HIGH;
  private d: boolean = CommonUtils.isDev();
  private s: boolean = false;
  private v: boolean = false;

  constructor() {
    this.soundEnabled$ = new Subject();
    this.voiceEnabled$ = new Subject();
  }

  set quality(q: GraphicsQuality) {
    this.q = q;
  }
  get quality(): GraphicsQuality {
    return this.q;
  }

  set debug(d: boolean) {
    this.d = d;
  }

  get debug(): boolean {
    return this.d;
  }

  set soundEnabled (soundEnabled) {
    this.s = soundEnabled;
    Howler.mute(!soundEnabled),
    this.soundEnabled$.next(soundEnabled);
  }

  set voiceEnabled (voiceEnabled) {
    this.v = voiceEnabled;
    this.voiceEnabled$.next(voiceEnabled);
  }

  get soundEnabled(): boolean {
    return this.s;
  }

  get voiceEnabled(): boolean {
    return this.v;
  }

  get config(): IConfig {
    return CONFIGS[this.q];
  }
}

export const configSvc = new ConfigService();
export default ConfigService;
