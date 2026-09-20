import { Text } from "@trpg/ui";

export function UnsavedCount({ count }: { count: number }) {
  return (
    <Text typography="subtitle2" weight="medium" foreground="warning" numeric render={<span />}>
      · 저장하지 않음 {count}칸
    </Text>
  );
}
