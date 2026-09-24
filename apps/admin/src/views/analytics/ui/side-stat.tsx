import { HStack, Text, VStack } from "@roll-and-call/ui";

interface SideStatProps {
  label: string;
  sub: string;
  value: string;
}

export function SideStat({ label, sub, value }: SideStatProps) {
  return (
    <HStack
      align="start"
      gap="100"
      className="border-t border-(--rc-color-border-subtle) py-125 first:border-t-0 first:pt-0"
    >
      <VStack gap="025" className="min-w-0 flex-1">
        <Text typography="body4" weight="bold">
          {label}
        </Text>
        <Text typography="body4" foreground="hint">
          {sub}
        </Text>
      </VStack>
      <Text typography="subtitle1" weight="extrabold" numeric>
        {value}
      </Text>
    </HStack>
  );
}
