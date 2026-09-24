import { Badge, type BadgeProps } from "@roll-and-call/ui";
import type { LucideIcon } from "lucide-react";

interface IconBadgeProps {
  icon: LucideIcon;
  colorPalette?: BadgeProps["colorPalette"];
  children: string;
}

// 아이콘과 글씨 사이는 --rc-size-space-050.
export function IconBadge({ icon: Icon, colorPalette, children }: IconBadgeProps) {
  return (
    <Badge colorPalette={colorPalette} className="gap-050">
      <Icon size={14} strokeWidth={2} aria-hidden />
      {children}
    </Badge>
  );
}
