import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import { locales, Locale, TranslationKey } from '../i18n/locales';

type Language = 'en' | 'es';

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => any;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: TranslationKey, replacements?: Record<string, string | number>): any => {
    const keys = key.split('.');
    let result = (locales[language] as any);
    
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if translation is missing
        let fallbackResult = (locales.en as any);
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
        }
        if (fallbackResult === undefined) {
            return key; // Return the key itself if no translation found
        }
        result = fallbackResult;
        break;
      }
    }
    
    if (typeof result === 'string' && replacements) {
      return Object.entries(replacements).reduce((acc, [placeholder, value]) => {
        return acc.replace(`{${placeholder}}`, String(value));
      }, result);
    }

    return result;
  }, [language]);
  
  const formatNumber = useCallback((value: number, options?: Intl.NumberFormatOptions): string => {
      if (isNaN(value)) return ''; // Handle NaN gracefully
      const langLocale = language === 'es' ? 'es-ES' : 'en-US';
      return new Intl.NumberFormat(langLocale, options).format(value);
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
    formatNumber,
  }), [language, t, formatNumber]);

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};