import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getCookie, setCookie, removeCookie } from "@/Utils/helpers";
import { fonts } from '@/Utils/constants';

const FONT_COOKIE_NAME = 'font';
const FONT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const FontContext = createContext<any>(null);

interface FontProviderProps {
  children: ReactNode;
  dbFont?: any;
}

export function FontProvider({ children, dbFont }: FontProviderProps) {
  const [font, _setFont] = useState<any>(dbFont);

  useEffect(() => {
    if (dbFont) {
      _setFont(dbFont);
    }
  }, [dbFont]);

  useEffect(() => {
    const applyFont = (f: any) => {
      const root = document.documentElement;
      root.classList.forEach((cls) => {
        if (cls.startsWith('font-')) root.classList.remove(cls);
      });
      root.classList.add(`font-${f}`);
    };

    applyFont(font);
  }, [font]);

  const setFont = (newFont: any) => {
    setCookie(FONT_COOKIE_NAME, newFont, FONT_COOKIE_MAX_AGE);
    _setFont(newFont);
  };

  const resetFont = () => {
    removeCookie(FONT_COOKIE_NAME);
    _setFont(fonts[0]);
  };

  return (
    <FontContext.Provider value={{ font, setFont, resetFont }}>
      {children}
    </FontContext.Provider>
  );
}

export const useFont = (): any => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
};
