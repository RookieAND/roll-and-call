import type { IconComponent } from "@/shared/ui";

export interface PaletteItem {
  id: string;
  icon: IconComponent;
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
