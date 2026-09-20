import { HStack, Text } from "@trpg/ui";
import { X } from "lucide-react";

export function AbsentMark() {
  return (
    <HStack gap="050" align="center">
      <X size={14} strokeWidth={2.6} className="text-danger-600" />
      <Text typography="subtitle1" foreground="danger">
        불참
      </Text>
    </HStack>
  );
}
