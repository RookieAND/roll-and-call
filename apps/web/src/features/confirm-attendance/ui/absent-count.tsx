import { Text } from "@trpg/ui";

interface AbsentCountProps {
  count: number;
}

export function AbsentCount({ count }: AbsentCountProps) {
  return (
    <Text typography="subtitle1" foreground="danger">
      불참 {count}명
    </Text>
  );
}
