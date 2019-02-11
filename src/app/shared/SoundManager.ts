import { Howl } from 'howler';

interface ISoundManagerOptions {
  volume?: number;
  autoplay?: boolean;
  loop?: boolean;
}

class SoundManager {
  private static SOUNDS: Map<string, Howl> = new Map();

  public static add(alias: string, path: string|string[], options: ISoundManagerOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      if (SoundManager.SOUNDS.has(alias)) {
        console.warn(`Sound "${alias}" already exists`);
        reject();
      }

      const paths = typeof path === 'string' ? [path] : path;
      const sound = new Howl({
        ...options,
        src: paths,
        onload: () => resolve(sound),
        onloaderror: () => reject()
      });

      SoundManager.SOUNDS.set(alias, sound);
    });
  }

  public static get(alias: string): Howl {
    if (!SoundManager.SOUNDS.has(alias)) {
      throw new Error(`Sound "${alias}" is missing`);
    }
    return SoundManager.SOUNDS.get(alias);
  }

  public static play(alias: string) {
    try {
      SoundManager.get(alias).play();
    } catch (e) {
      console.warn(`Could not play sound "${alias}"`);
    }
  }

  public static playWithPromise(alias: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const sound = SoundManager.get(alias);
        sound.once('playerror', reject);
        sound.once('end', () => resolve(sound));
        sound.play();
      } catch (e) {
        console.warn(`Could not play sound "${alias}"`);
        reject();
      }
    });
  }
}

export default SoundManager;
