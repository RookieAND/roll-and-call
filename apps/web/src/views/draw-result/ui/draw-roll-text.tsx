import { Text } from "@trpg/ui";

interface DrawRollTextProps {
  value: number;
  emphasized: boolean;
  strong: boolean;
}

export function DrawRollText({ value, emphasized, strong }: DrawRollTextProps) {
  const typography = emphasized ? "heading2" : "subtitle1";
  const foreground = strong ? "normal" : "muted";

  return (
    <Text
      numeric
      typography={typography}
      weight="extrabold"
      foreground={foreground}
      className="min-w-8 text-right tracking-tight"
    >
      {value}
    </Text>
  );
}
