import { HStack, Text } from "@trpg/ui";
import { Lock } from "lucide-react";

interface LockedModeNoticeProps {
  label: string;
}

export function LockedModeNotice({ label }: LockedModeNoticeProps) {
  return (
    <HStack
      align="start"
      gap="100"
      className="rounded-400 border border-danger-200 bg-danger-50 px-150 py-150"
    >
      <Lock size={14} strokeWidth={2.2} aria-hidden className="mt-025 flex-none text-danger-600" />
      <Text
        typography="body4"
        foreground="muted"
        render={<p />}
        className="min-w-0 flex-1 text-pretty leading-[1.55]"
      >
        <b className="text-danger-600">신청자가 있어 {label}은 바꿀 수 없습니다.</b>
        <br />
        변경하려면 참여자 관리에서 명단을 비워주세요.
      </Text>
    </HStack>
  );
}
