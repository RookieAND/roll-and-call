"use client";

import { SegmentedControl } from "@roll-and-call/ui";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { isThemeMode, THEME_MODE, type ThemeMode } from "./theme-mode";

const THEME_STORAGE_KEY = "theme";

const OPTIONS = [
  { value: THEME_MODE.system, label: "시스템", icon: <Monitor size={16} /> },
  { value: THEME_MODE.light, label: "라이트", icon: <Sun size={16} /> },
  { value: THEME_MODE.dark, label: "다크", icon: <Moon size={16} /> },
] as const;

interface ThemeSettingProps {
  className?: string;
}

// 'system'도 저장한다. app/layout.tsx의 theme-init 인라인 스크립트가 첫 페인트 전에 같은 규칙으로 적용하므로 함께 바꾼다.
export function ThemeSetting({ className }: ThemeSettingProps) {
  const [mode, setMode] = useState<ThemeMode>(THEME_MODE.system);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (isThemeMode(saved)) setMode(saved);
    } catch {}
  }, []);

  function select(nextMode: ThemeMode) {
    setMode(nextMode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextMode);
    } catch {}
    const dark =
      nextMode === THEME_MODE.dark ||
      (nextMode === THEME_MODE.system && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? THEME_MODE.dark : THEME_MODE.light;
  }

  return (
    <SegmentedControl.Root
      value={mode}
      onValueChange={(next) => select(next as ThemeMode)}
      aria-label="화면 테마"
      className={className}
    >
      {OPTIONS.map((option) => (
        <SegmentedControl.Item key={option.value} value={option.value} aria-label={option.label}>
          {option.icon}
        </SegmentedControl.Item>
      ))}
    </SegmentedControl.Root>
  );
}
