import { Text } from "@roll-and-call/ui";

interface ProfileBlockLabelProps {
  label: string;
}

export function ProfileBlockLabel({ label }: ProfileBlockLabelProps) {
  return (
    <Text
      weight="bold"
      typography="body4"
      foreground="muted"
      render={<h2 />}
      className="mb-100 block"
    >
      {label}
    </Text>
  );
}
