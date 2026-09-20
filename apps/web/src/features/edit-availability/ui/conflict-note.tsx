import { HStack, Text } from "@trpg/ui";
import { CircleAlert } from "lucide-react";

export function ConflictNote({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <HStack align="start" gap="100" className="pr-050 pb-025 pl-600">
      <CircleAlert size={14} className="mt-px flex-none text-danger-600" aria-hidden />
      <Text typography="body4" foreground="danger" render={<p />} className="flex-1 leading-[1.55]">
        {message}
      </Text>
    </HStack>
  );
}
