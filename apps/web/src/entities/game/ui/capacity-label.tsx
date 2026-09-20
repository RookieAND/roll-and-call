import { Text } from "@trpg/ui";

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
