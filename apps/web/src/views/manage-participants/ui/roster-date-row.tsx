import { Badge, Card, HStack, Text, cn } from "@roll-and-call/ui";
import type { LucideIcon } from "lucide-react";

interface RosterDateRowProps {
  icon: LucideIcon;
  iconClass?: string;
  label: string;
  value: string;
  badge: string;
  badgePalette: "primary" | "gray";
}

export function RosterDateRow({
  icon: Icon,
  iconClass = "text-hint",
  label,
  value,
  badge,
  badgePalette,
}: RosterDateRowProps) {
  return (
    <Card.Root padding="sm" radius={500}>
      <HStack align="center" gap="100" className="px-025">
        <Icon size={15} strokeWidth={2.2} aria-hidden className={cn("shrink-0", iconClass)} />
        <Text typography="body4" foreground="hint" className="min-w-0 flex-1">
          {label}
        </Text>
        <Text numeric typography="subtitle2" className="shrink-0">
          {value}
        </Text>
        <Badge colorPalette={badgePalette} className="tabular-nums">
          {badge}
        </Badge>
      </HStack>
    </Card.Root>
  );
}
