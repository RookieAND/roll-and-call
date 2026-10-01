import { Badge, type BadgeProps } from "@roll-and-call/ui";
import type { LucideIcon } from "lucide-react";

interface IconBadgeProps {
  icon: LucideIcon;
  colorPalette?: BadgeProps["colorPalette"];
  children: string;
}

export function IconBadge({ icon: Icon, colorPalette, children }: IconBadgeProps) {
  return (
    <Badge colorPalette={colorPalette} className="gap-050">
      <Icon size={14} strokeWidth={2} aria-hidden />
      {children}
    </Badge>
  );
}
