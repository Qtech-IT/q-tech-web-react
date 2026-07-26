import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getCookie, setCookie } from "@/Utils/helpers";
import { useFormState } from 'react-hook-form';

// Cookie constants
const LAYOUT_COLLAPSIBLE_COOKIE_NAME = 'layout_collapsible';
const LAYOUT_VARIANT_COOKIE_NAME = 'layout_variant';
const LAYOUT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Default values
const DEFAULT_VARIANT = 'inset';
const DEFAULT_COLLAPSIBLE = 'icon';

const LayoutContext = createContext<any>(null);

interface LayoutProviderProps {
  children: ReactNode;
  themeConfig?: any;
}

export function LayoutProvider({ children, themeConfig: siteThemeSettings }: LayoutProviderProps) {
  const dbSidebar = siteThemeSettings?.sidebar;

  const [collapsible, _setCollapsible] =  useState<any>(() => {
    const saved = getCookie(LAYOUT_COLLAPSIBLE_COOKIE_NAME);
    return DEFAULT_COLLAPSIBLE;
  });

  const [variant, _setVariant] = useState<any>(dbSidebar);

  useEffect(() => {
    if (dbSidebar && dbSidebar !== variant) {
      _setVariant(dbSidebar);
    }
  }, [dbSidebar, variant]);

  const setCollapsible = (newCollapsible: any) => {
    _setCollapsible(newCollapsible);
    setCookie(LAYOUT_COLLAPSIBLE_COOKIE_NAME, newCollapsible, LAYOUT_COOKIE_MAX_AGE);
  };

  const setVariant = (newVariant: any) => {
    _setVariant(newVariant);
    setCookie(LAYOUT_VARIANT_COOKIE_NAME, newVariant, LAYOUT_COOKIE_MAX_AGE);
  };

  const resetLayout = () => {
    setCollapsible(DEFAULT_COLLAPSIBLE);
    setVariant(DEFAULT_VARIANT);
  };

  const contextValue = {
    resetLayout,
    defaultCollapsible: DEFAULT_COLLAPSIBLE,
    collapsible,
    setCollapsible,
    defaultVariant: DEFAULT_VARIANT,
    variant,
    setVariant,
  };

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout(): any {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
