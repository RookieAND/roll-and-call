"use client";

import { IconButton } from "@roll-and-call/ui";
import { Moon, Sun } from "lucide-react";

import { applyThemeMode } from "./apply-theme-mode";
import { THEME_MODE } from "./theme-mode";

// 설정 화면이 없는 비로그인 방문자용. 아이콘은 CSS로 바꿔 첫 페인트에서도 테마와 맞는다.
export function ThemeToggleButton() {
  function toggle() {
    const dark = document.documentElement.dataset.theme === THEME_MODE.dark;
    applyThemeMode(dark ? THEME_MODE.light : THEME_MODE.dark);
  }

  return (
    <IconButton
      variant="ghost"
      aria-label="테마 바꾸기"
      onClick={toggle}
      className="h-11 w-11 text-gray-600"
    >
      <Moon size={19} className="dark:hidden" />
      <Sun size={19} className="hidden dark:block" />
    </IconButton>
  );
}
