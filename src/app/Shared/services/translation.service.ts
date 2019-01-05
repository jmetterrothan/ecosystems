import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import Main from '../../Main';

import { EN_TRANSLATION } from '@shared/i18n/en.constants';
import { FR_TRANSLATION } from '@shared/i18n/fr.constants';

class TranslationService {

  init(): Promise<any> {
    return new Promise((resolve, reject) => {
      i18next
        .use(LanguageDetector)
        .init({
          debug: Main.DEBUG,
          fallbackLng: 'en',
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

  translate(key: string): string {
    return i18next.t(key);
  }

  switchlanguage() {
    // i18next.changeLanguage()
  }

}

export const translationSvc = new TranslationService();
export default TranslationService;
