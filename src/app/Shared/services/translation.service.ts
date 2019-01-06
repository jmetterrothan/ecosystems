import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import GraphicsConfigService, { configSvc } from './graphicsConfig.service';

import { EN_TRANSLATION } from '@shared/i18n/en.constants';
import { FR_TRANSLATION } from '@shared/i18n/fr.constants';

class TranslationService {

  private configSvc: GraphicsConfigService;

  constructor() {
    this.configSvc = configSvc;
  }

  init(): Promise<any> {
    return new Promise((resolve, reject) => {
      i18next
        .use(LanguageDetector)
        .init({
          debug: this.configSvc.config.DEBUG,
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

  switchLanguage(language: string) {
    i18next.changeLanguage(language);
  }

}

export const translationSvc = new TranslationService();
export default TranslationService;
