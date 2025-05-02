
import { translations as commonTranslations } from './index';
import { animalTranslations } from './animal-translations';
import { uiTranslations } from './ui-translations';

// Merge all translations
export const allTranslations = {
  ...commonTranslations,
  ...animalTranslations,
  ...uiTranslations
};

export type Language = 'en' | 'tr';
