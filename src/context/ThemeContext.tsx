'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { themes, getThemeForPath, applyTheme, type ThemeKey, type Theme } from '@/lib/themes';

interface ThemeContextType {
  activeTheme: ThemeKey;
  theme: Theme;
  isTransitioning: boolean;
  transitionColor: string;
  navigateWithTransition: (href: string, theme: ThemeKey) => void;
  onCurtainMidpoint: () => void;
  onCurtainComplete: () => void;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTheme, setActiveTheme] = useState<ThemeKey>(() => getThemeForPath(pathname));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionColor, setTransitionColor] = useState('');
  const pendingHrefRef = useRef<string | null>(null);
  const pendingThemeRef = useRef<ThemeKey | null>(null);

  useEffect(() => {
    applyTheme(themes[activeTheme]);
  }, [activeTheme]);

  const navigateWithTransition = useCallback((href: string, theme: ThemeKey) => {
    if (isTransitioning) return;
    pendingHrefRef.current = href;
    pendingThemeRef.current = theme;
    setTransitionColor(themes[theme].accent);
    setIsTransitioning(true);
  }, [isTransitioning]);

  const onCurtainMidpoint = useCallback(() => {
    if (pendingHrefRef.current) {
      router.push(pendingHrefRef.current);
    }
    if (pendingThemeRef.current) {
      setActiveTheme(pendingThemeRef.current);
      applyTheme(themes[pendingThemeRef.current]);
    }
  }, [router]);

  const onCurtainComplete = useCallback(() => {
    setIsTransitioning(false);
    pendingHrefRef.current = null;
    pendingThemeRef.current = null;
  }, []);

  const theme = themes[activeTheme];

  return (
    <ThemeContext.Provider value={{
      activeTheme,
      theme,
      isTransitioning,
      transitionColor,
      navigateWithTransition,
      onCurtainMidpoint,
      onCurtainComplete,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
