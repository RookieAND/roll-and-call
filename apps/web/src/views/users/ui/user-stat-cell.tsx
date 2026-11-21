import { Card, HStack, cn, Text, VStack } from "@roll-and-call/ui";
import type { LucideIcon } from "lucide-react";

interface UserStatCellProps {
  icon: LucideIcon;
  value: number;
  label: string;
  tinted?: boolean;
}

export function UserStatCell({ icon: Icon, value, label, tinted = false }: UserStatCellProps) {
  const foreground = tinted ? "primary" : "normal";
  return (
    <Card.Root
      background="subtle"
      padding="sm"
      radius={400}
      render={<HStack align="center" gap="100" />}
    >
      <Icon
        size={18}
        aria-hidden
        className={cn("flex-none", tinted ? "text-tinted-ink" : "text-hint")}
      />
      <VStack gap="025" className="min-w-0">
        <Text typography="subtitle1" weight="bold" numeric foreground={foreground}>
          {value}
        </Text>
        <Text truncate typography="body4" foreground={tinted ? "primary" : "muted"}>
          {label}
        </Text>
      </VStack>
    </Card.Root>
  );
}
