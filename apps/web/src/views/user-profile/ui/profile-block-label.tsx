import { Text } from "@trpg/ui";

export function ProfileBlockLabel({ label }: { label: string }) {
  return (
    <Text
      weight="bold"
      typography="body4"
      foreground="muted"
      render={<h2 />}
      className="mb-2 block"
    >
      {label}
    </Text>
  );
}
