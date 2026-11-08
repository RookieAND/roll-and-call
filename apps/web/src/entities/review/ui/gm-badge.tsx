import { Text } from "@roll-and-call/ui";

export function GmBadge() {
  return (
    <Text
      typography="body4"
      weight="extrabold"
      foreground="inherit"
      render={<span />}
      className="text-gm"
    >
      GM
    </Text>
  );
}
