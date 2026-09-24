import type { LucideIcon } from "lucide-react";

export interface PaletteItem {
  id: string;
  icon: LucideIcon;
  tone?: "gray" | "primary" | "danger";
  title: string;
  meta?: string;
  href: string;
  shortcut?: string;
}

export interface PaletteGroup {
  label: string;
  items: PaletteItem[];
}
