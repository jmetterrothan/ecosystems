import { Subject, Observable } from 'rxjs';

class VoiceService {
  private wordDetectionSource: Subject<boolean>;
  wordDetection$: Observable<boolean>;

  constructor() {
    this.wordDetectionSource = new Subject();
    this.wordDetection$ = this.wordDetectionSource.asObservable();
  }

  detectPlacementWord() {
    this.wordDetectionSource.next(true);
  }
}

export const voiceSvc = new VoiceService();
export default VoiceService;
