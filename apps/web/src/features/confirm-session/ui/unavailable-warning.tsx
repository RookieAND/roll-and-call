import { HStack, Text } from "@trpg/ui";
import { CircleAlert } from "lucide-react";

export function UnavailableWarning({ names }: { names: string[] }) {
  return (
    <HStack gap="100" className="border-t border-notice-border bg-notice-bg px-175 py-150">
      <CircleAlert size={14} className="mt-025 shrink-0 text-notice-ink" aria-hidden />
      <Text
        typography="body4"
        foreground="inherit"
        render={<p />}
        className="min-w-0 text-notice-ink"
      >
        {names.join(", ")}는 이 시간에 불가입니다.
        <br />
        확정 전에 이 날 진행이 가능한지 물어보세요.
      </Text>
    </HStack>
  );
}
