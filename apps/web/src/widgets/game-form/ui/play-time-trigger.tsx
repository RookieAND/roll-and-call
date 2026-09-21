import { Select, Text } from "@trpg/ui";

interface PlayTimeTriggerProps {
  value: number;
  unit: string;
}

export function PlayTimeTrigger({ value, unit }: PlayTimeTriggerProps) {
  return (
    <Select.Trigger aria-label={`플레이타임 ${unit}`}>
      <Text numeric typography="body3" weight="medium" className="flex-1">
        {value}
      </Text>
      <Text typography="body4" foreground="hint">
        {unit}
      </Text>
      <span aria-hidden className="text-gray-500">
        ▾
      </span>
    </Select.Trigger>
  );
}
