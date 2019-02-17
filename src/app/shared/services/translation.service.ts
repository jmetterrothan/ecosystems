import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { configSvc } from './config.service';

import { EN_TRANSLATION } from '@app/shared/i18n/en/en.constants';
import { FR_TRANSLATION } from '@app/shared/i18n/fr/fr.constants';

class TranslationService {
  init(): Promise<any> {
    return new Promise((resolve, reject) => {
      i18next
        .use(LanguageDetector)
        .init({
          debug: configSvc.debug,
          fallbackLng: ['en', 'fr'],
          resources: {
            en: {
              translation: {
                ...EN_TRANSLATION
              }
            },
            fr: {
              translation: {
                ...FR_TRANSLATION
              }
            }
          }
        })
        .then(() => resolve())
        .catch(err => reject(err));
    });
  }

  translate(key: string, variables?: Object): string | null {
    if (i18next.exists(key)) return i18next.t(key, variables);
    console.error(`${key} does not exist`);
    return null;
  }

  async switchLanguage(language: string) {
    await i18next.changeLanguage(language);
  }

  getCurrentLanguage(): string {
    return i18next.language;
  }
}

export const translationSvc = new TranslationService();
export default TranslationService;
