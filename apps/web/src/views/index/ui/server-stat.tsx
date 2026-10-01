import { Text, VStack, cn } from "@roll-and-call/ui";

interface ServerStatProps {
  label: string;
  value: string;
  emphasis: "primary" | "normal" | "hint";
  className?: string;
}

export function ServerStat({ label, value, emphasis, className }: ServerStatProps) {
  return (
    <VStack gap="025" className={cn("min-w-0 px-175 py-125", className)}>
      <Text typography="body5" foreground="hint">
        {label}
      </Text>
      <Text typography="subtitle2" weight="bold" foreground={emphasis} numeric truncate>
        {value}
      </Text>
    </VStack>
  );
}
