import { THEME_MODE, type ThemeMode } from "./theme-mode";

export const THEME_STORAGE_KEY = "theme";

// 'system'도 저장한다. app/layout.tsx의 theme-init 인라인 스크립트가 첫 페인트 전에 같은 규칙으로 적용하므로 함께 바꾼다.
export function applyThemeMode(mode: ThemeMode) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {}
  const dark =
    mode === THEME_MODE.dark ||
    (mode === THEME_MODE.system && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? THEME_MODE.dark : THEME_MODE.light;
}
