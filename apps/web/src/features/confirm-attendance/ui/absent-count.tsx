import { Text } from "@trpg/ui";

export function AbsentCount({ count }: { count: number }) {
  return (
    <Text typography="subtitle1" foreground="danger">
      불참 {count}명
    </Text>
  );
}
