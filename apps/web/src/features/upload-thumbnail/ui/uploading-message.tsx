import { Text } from "@trpg/ui";
import { Loader2 } from "lucide-react";

export function UploadingMessage() {
  return (
    <>
      <Loader2 size={22} className="animate-spin text-gray-400" aria-hidden />
      <Text typography="body3" foreground="muted">
        올리는 중
      </Text>
    </>
  );
}
