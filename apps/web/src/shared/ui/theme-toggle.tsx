"use client";

import { IconButton } from "@trpg/ui";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }

  return (
    <IconButton
      variant="outline"
      onClick={toggle}
      aria-label="테마 전환"
      className="h-9 w-9 border-gray-200 text-gray-600"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </IconButton>
  );
}
