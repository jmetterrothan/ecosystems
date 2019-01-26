import { Subject, Observable } from 'rxjs';

class VoiceService {
<<<<<<< HEAD
  private wordDetectionSource: Subject<boolean>;
  wordDetection$: Observable<boolean>;

  constructor() {
    this.wordDetectionSource = new Subject();
    this.wordDetection$ = this.wordDetectionSource.asObservable();
  }

  detectPlacementWord() {
    this.wordDetectionSource.next(true);
=======
  private voiceStateSource: Subject<boolean>;
  voiceState$: Observable<boolean>;

  constructor() {
    this.voiceStateSource = new Subject();
    this.voiceState$ = this.voiceStateSource.asObservable();
  }

  placeObject() {
    this.voiceStateSource.next(true);
>>>>>>> 31-voice
  }
}

export const voiceSvc = new VoiceService();
export default VoiceService;
