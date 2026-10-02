import { HStack, Text, VStack } from "@roll-and-call/ui";

interface SideStatProps {
  label: string;
  sub: string;
  value: string;
}

export function SideStat({ label, sub, value }: SideStatProps) {
  return (
    <HStack
      align="baseline"
      gap="150"
      className="-mt-px min-w-0 border-t border-(--rc-color-border-subtle) py-100"
    >
      <VStack gap="025" className="min-w-0 flex-1">
        <Text typography="body4" foreground="muted" className="break-keep">
          {label}
        </Text>
        <Text typography="body4" foreground="hint">
          {sub}
        </Text>
      </VStack>
      <Text typography="subtitle2" numeric className="text-right whitespace-nowrap">
        {value}
      </Text>
    </HStack>
  );
}
