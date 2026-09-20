import { HStack, Text } from "@trpg/ui";
import { CircleAlert } from "lucide-react";

export function SessionEyebrow({ label }: { label: string }) {
  return (
    <HStack align="center" gap="100" className="mb-100 text-warning-600">
      <CircleAlert size={14} strokeWidth={2.2} aria-hidden className="shrink-0" />
      <Text weight="bold" typography="body4" foreground="inherit">
        {label}
      </Text>
    </HStack>
  );
}
