export type ThemeKey = 'home' | 'fotografia' | 'wideo' | 'threed';

export interface Theme {
  key: ThemeKey;
  bg: string;
  surface: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  isLight: boolean;
}

export const themes: Record<ThemeKey, Theme> = {
  home: {
    key: 'home',
    bg: '#0d0d0f',
    surface: '#1a1a1f',
    border: '#2a2a38',
    text: '#e8e8f0',
    textMuted: '#6868a0',
    accent: '#9090c0',
    accentHover: '#b0b0e0',
    isLight: false,
  },
  fotografia: {
    key: 'fotografia',
    bg: '#f5f5f7',
    surface: '#ffffff',
    border: '#d8d8e0',
    text: '#1a1a24',
    textMuted: '#6b6b80',
    accent: '#2a2a3a',
    accentHover: '#0a0a18',
    isLight: true,
  },
  wideo: {
    key: 'wideo',
    bg: '#0f0808',
    surface: '#1c0c0c',
    border: '#3a1414',
    text: '#f0e8e8',
    textMuted: '#907070',
    accent: '#cc3333',
    accentHover: '#ff4444',
    isLight: false,
  },
  threed: {
    key: 'threed',
    bg: '#060812',
    surface: '#0d1020',
    border: '#1a2040',
    text: '#e0e8ff',
    textMuted: '#5060a0',
    accent: '#00cccc',
    accentHover: '#00ffff',
    isLight: false,
  },
};

export const pathToTheme: Record<string, ThemeKey> = {
  '/': 'home',
  '/fotografia': 'fotografia',
  '/wideo': 'wideo',
  '/3d': 'threed',
  '/kontakt': 'home',
};

export function getThemeForPath(pathname: string): ThemeKey {
  for (const [path, theme] of Object.entries(pathToTheme)) {
    if (pathname === path || pathname.startsWith(path + '/')) {
      return theme;
    }
  }
  return 'home';
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.style.setProperty('--color-bg', theme.bg);
  root.style.setProperty('--color-surface', theme.surface);
  root.style.setProperty('--color-border', theme.border);
  root.style.setProperty('--color-text', theme.text);
  root.style.setProperty('--color-text-muted', theme.textMuted);
  root.style.setProperty('--color-accent', theme.accent);
  root.style.setProperty('--color-accent-hover', theme.accentHover);
}
