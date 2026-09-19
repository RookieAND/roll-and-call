import { Text } from "@trpg/ui";

export function ProfileBlockLabel({ label }: { label: string }) {
  return (
    <Text
      typography="subtitle2"
      foreground="muted"
      render={<h2 />}
      className="mb-2 block text-[12.5px]"
    >
      {label}
    </Text>
  );
}
