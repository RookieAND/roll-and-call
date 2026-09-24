import { HStack, Text } from "@roll-and-call/ui";

interface LegendProps {
  items: readonly { label: string; colorVariable: string }[];
}

export function Legend({ items }: LegendProps) {
  return (
    <HStack gap="175" render={<ul />} className="flex-wrap">
      {items.map((item) => (
        <HStack key={item.label} align="center" gap="075" render={<li />}>
          <span
            aria-hidden
            className="size-[11px] rounded-100"
            style={{ background: `var(${item.colorVariable})` }}
          />
          <Text typography="body4" foreground="muted">
            {item.label}
          </Text>
        </HStack>
      ))}
    </HStack>
  );
}
