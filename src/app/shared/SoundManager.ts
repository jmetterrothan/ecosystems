import { Howl } from 'howler';

interface ISoundManagerOptions {
  volume: number;
}

class SoundManager {
  private static SOUNDS: Map<string, Howl> = new Map();

  public static add(alias: string, path: string|string[], options: ISoundManagerOptions) {
    if (SoundManager.SOUNDS.has(alias)) {
      console.warn(`Sound "${alias}" already exists`);
      return;
    }

    const paths = typeof path === 'string' ? [path] : path;
    const volume = options.volume | 1;
    const sound = new Howl({
      volume,
      src: paths
    });

    SoundManager.SOUNDS.set(alias, sound);
  }

  public static get(alias: string): Howl {
    if (!SoundManager.SOUNDS.has(alias)) {
      throw new Error(`Sound "${alias}" is missing`);
    }
    return SoundManager.SOUNDS.get(alias);
  }

  public static play(alias: string) {
    SoundManager.get(alias).play();
  }
}

export default SoundManager;
