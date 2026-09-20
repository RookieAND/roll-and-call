import { Text } from "@trpg/ui";

export function CapacityLabel({ text }: { text: string }) {
  return (
    <Text typography="body4" weight="medium" foreground="muted" numeric>
      {text}
    </Text>
  );
}
