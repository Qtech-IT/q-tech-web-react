import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { getCookie, setCookie, removeCookie } from "@/Utils/helpers";
import type { ReactNode } from "react"; 

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  defaultTheme: Theme;
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  resetTheme: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  dbTheme?: Theme;
}

const DEFAULT_THEME: Theme = "system";
const THEME_COOKIE_NAME = "vite-ui-theme";
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const initialState: ThemeContextType = {
  defaultTheme: DEFAULT_THEME,
  resolvedTheme: "light",
  theme: DEFAULT_THEME,
  setTheme: () => {},
  resetTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = THEME_COOKIE_NAME,
  dbTheme,
  ...props
}: ThemeProviderProps) {
  const [theme, _setTheme] = useState<Theme>(dbTheme ?? defaultTheme);

  useEffect(() => {
    if (dbTheme) {
      _setTheme(dbTheme);
    }
  }, [dbTheme]);

  const resolvedTheme = useMemo<"light" | "dark">(() => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (currentResolvedTheme: "light" | "dark") => {
      root.classList.remove("light", "dark");
      root.classList.add(currentResolvedTheme);
    };

    const handleChange = () => {
      if (theme === "system") {
        const systemTheme = mediaQuery.matches ? "dark" : "light";
        applyTheme(systemTheme);
      }
    };

    applyTheme(resolvedTheme);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, resolvedTheme]);

  const setTheme = (newTheme: Theme) => {
    setCookie(storageKey, newTheme, THEME_COOKIE_MAX_AGE);
    _setTheme(newTheme);
  };

  const resetTheme = () => {
    removeCookie(storageKey);
    _setTheme(DEFAULT_THEME);
  };

  const contextValue: ThemeContextType = {
    defaultTheme,
    resolvedTheme,
    theme,
    setTheme,
    resetTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue} {...props}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
