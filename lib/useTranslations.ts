import { useLanguage } from "./LanguageContext";
import { en } from "./translations/en";
import { id } from "./translations/id";
import { applyOverrides } from "./contentOverrides";

const translations = { en, id };

export type Translations = typeof en;
export type IndustryTranslations = Translations["industries"];
export type IndustryTranslationKey = keyof IndustryTranslations;

export function useTranslations(): Translations {
  const { language, contentOverrides } = useLanguage();
  return applyOverrides(translations[language], contentOverrides, "translations", language);
}