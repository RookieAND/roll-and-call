"use client";

import { SegmentControl } from "@trpg/ui";
import { useEffect, useState } from "react";

type ThemeMode = "system" | "light" | "dark";

const OPTIONS = [
  { value: "system", label: "시스템" },
  { value: "light", label: "라이트" },
  { value: "dark", label: "다크" },
] as const;

const isThemeMode = (value: string | null): value is ThemeMode =>
  value === "system" || value === "light" || value === "dark";

// 시스템 · 라이트 · 다크 3단. 'system'도 저장하고, app/layout.tsx의 theme-init이 첫 페인트 전에 같은 규칙으로 적용한다.
export function ThemeSetting({ className }: { className?: string }) {
  const [mode, setMode] = useState<ThemeMode>("system");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (isThemeMode(saved)) setMode(saved);
    } catch {
      /* ignore */
    }
  }, []);

  function select(next: ThemeMode) {
    setMode(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* ignore */
    }
    const dark =
      next === "dark" || (next === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  }

  return (
    <SegmentControl
      options={OPTIONS}
      value={mode}
      onChange={select}
      aria-label="화면 테마"
      className={className}
    />
  );
}
