import { Text } from "@roll-and-call/ui";

interface ProfileBlockLabelProps {
  label: string;
}

export function ProfileBlockLabel({ label }: ProfileBlockLabelProps) {
  return (
    <Text typography="heading3" render={<h2 />} className="mb-100 block">
      {label}
    </Text>
  );
}
