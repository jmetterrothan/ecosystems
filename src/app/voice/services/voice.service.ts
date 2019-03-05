import { Subject, Observable } from 'rxjs';

class VoiceService {
  private wordDetectionSource: Subject<string>;
  wordDetection$: Observable<string>;

  constructor() {
    this.wordDetectionSource = new Subject();
    this.wordDetection$ = this.wordDetectionSource.asObservable();
  }

  detectWord(label) {
    this.wordDetectionSource.next(label);
  }
}

export const voiceSvc = new VoiceService();
export default VoiceService;
