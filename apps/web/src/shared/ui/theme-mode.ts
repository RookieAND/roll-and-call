export const THEME_MODE = {
  system: "system",
  light: "light",
  dark: "dark",
} as const;

export type ThemeMode = (typeof THEME_MODE)[keyof typeof THEME_MODE];

export function isThemeMode(value: string | null): value is ThemeMode {
  return Object.values<string | null>(THEME_MODE).includes(value);
}
