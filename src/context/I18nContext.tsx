import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, Strings, translations } from '../i18n/translations';

const LANG_KEY = 'APP_LANG';

interface I18nContextProps {
  lang: Language;
  setLang: (l: Language) => void;
  t: Strings;
}

export const I18nContext = createContext<I18nContextProps>({
  lang: 'uk',
  setLang: () => {},
  t: translations.uk,
});

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>('uk');

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY).then(val => {
      if (val === 'uk' || val === 'en') setLangState(val);
    });
  }, []);

  const setLang = async (l: Language) => {
    setLangState(l);
    await AsyncStorage.setItem(LANG_KEY, l);
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
