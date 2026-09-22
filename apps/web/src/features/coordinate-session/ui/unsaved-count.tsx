import { Text } from "@roll-and-call/ui";

interface UnsavedCountProps {
  count: number;
}

export function UnsavedCount({ count }: UnsavedCountProps) {
  return (
    <Text typography="subtitle2" weight="medium" foreground="warning" numeric render={<span />}>
      · 저장하지 않음 {count}칸
    </Text>
  );
}
