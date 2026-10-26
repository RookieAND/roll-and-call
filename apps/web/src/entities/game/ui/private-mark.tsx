import { HStack, Text } from "@roll-and-call/ui";
import { Lock } from "lucide-react";

// 배지가 아니라 자물쇠와 문장이다. 한 줄 라벨이라 줄바꿈하지 않는다.
export function PrivateMark() {
  return (
    <HStack render={<span />} align="center" gap="050" className="whitespace-nowrap text-hint">
      <Lock size={13} strokeWidth={2.2} aria-hidden className="flex-none" />
      <Text typography="body5" foreground="hint" render={<span />}>
        비공개
      </Text>
    </HStack>
  );
}
