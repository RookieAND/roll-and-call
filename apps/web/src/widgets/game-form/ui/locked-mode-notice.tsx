import { Callout } from "@roll-and-call/ui";
import { Lock } from "lucide-react";

interface LockedModeNoticeProps {
  label: string;
}

export function LockedModeNotice({ label }: LockedModeNoticeProps) {
  return (
    <Callout.Root colorPalette="danger" size="sm">
      <Callout.Icon>
        <Lock size={14} strokeWidth={2.2} />
      </Callout.Icon>
      <Callout.Title>{`신청자가 있어 ${label}은 바꿀 수 없습니다.`}</Callout.Title>
      <Callout.Description>변경하려면 참여자 관리에서 명단을 비워주세요.</Callout.Description>
    </Callout.Root>
  );
}
