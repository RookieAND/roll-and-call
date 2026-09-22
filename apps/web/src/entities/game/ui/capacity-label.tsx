import { Text } from "@roll-and-call/ui";

interface CapacityLabelProps {
  text: string;
}

export function CapacityLabel({ text }: CapacityLabelProps) {
  return (
    <Text typography="body4" weight="medium" foreground="muted" numeric>
      {text}
    </Text>
  );
}
