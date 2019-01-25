import { Subject, Observable } from 'rxjs';

class VoiceService {
  private voiceStateSource: Subject<boolean>;
  voiceState$: Observable<boolean>;

  constructor() {
    this.voiceStateSource = new Subject();
    this.voiceState$ = this.voiceStateSource.asObservable();
  }

  placeObject() {
    this.voiceStateSource.next(true);
  }
}

export const voiceSvc = new VoiceService();
export default VoiceService;
