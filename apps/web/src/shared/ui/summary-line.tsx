import { Badge, Card, HStack, Text } from "@roll-and-call/ui";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const summaryIcon = cva("shrink-0", {
  variants: {
    tone: {
      success: "text-success-600",
      muted: "text-gray-600",
    },
  },
});

interface SummaryLineProps extends Required<VariantProps<typeof summaryIcon>> {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  badge?: string;
}

export function SummaryLine({ icon: Icon, tone, label, value, badge }: SummaryLineProps) {
  return (
    <Card padding="none" className="rounded-500 px-175 py-150">
      <HStack align="center" gap="100">
        <Icon size={15} strokeWidth={2.2} aria-hidden className={summaryIcon({ tone })} />
        <Text typography="body4" foreground="muted" className="min-w-0 flex-1">
          {label}
        </Text>
        <Text numeric typography="subtitle2" className="shrink-0">
          {value}
        </Text>
        {badge && (
          <Badge colorPalette="gray" className="shrink-0">
            {badge}
          </Badge>
        )}
      </HStack>
    </Card>
  );
}
