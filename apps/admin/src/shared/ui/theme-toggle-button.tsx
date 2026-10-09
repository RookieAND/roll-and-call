"use client";

import { IconButton } from "@roll-and-call/ui";
import { Moon, Sun } from "lucide-react";

// 아이콘은 CSS로 바꿔 첫 페인트에서도 테마와 맞는다. 저장 키는 layout의 theme-init과 같다.
export function ThemeToggleButton() {
  function toggle() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <IconButton variant="ghost" aria-label="테마 바꾸기" onClick={toggle} className="text-gray-600">
      <Moon size={18} className="dark:hidden" />
      <Sun size={18} className="hidden dark:block" />
    </IconButton>
  );
}
