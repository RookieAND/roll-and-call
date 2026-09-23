"use client";

import { SegmentedControl } from "@roll-and-call/ui";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { applyThemeMode, THEME_STORAGE_KEY } from "./apply-theme-mode";
import { isThemeMode, THEME_MODE, type ThemeMode } from "./theme-mode";

const OPTIONS = [
  { value: THEME_MODE.system, label: "시스템", icon: <Monitor size={16} /> },
  { value: THEME_MODE.light, label: "라이트", icon: <Sun size={16} /> },
  { value: THEME_MODE.dark, label: "다크", icon: <Moon size={16} /> },
] as const;

interface ThemeSettingProps {
  className?: string;
}

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
    applyThemeMode(nextMode);
  }

  return (
    <SegmentedControl.Root
      value={mode}
      size="sm"
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
