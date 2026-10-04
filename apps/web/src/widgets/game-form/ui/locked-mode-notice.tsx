import { Callout } from "@roll-and-call/ui";

interface LockedModeNoticeProps {
  label: string;
}

export function LockedModeNotice({ label }: LockedModeNoticeProps) {
  return (
    <Callout.Root colorPalette="gray" size="sm">
      <Callout.Description>
        {`신청자가 있어 ${label}은 바꿀 수 없습니다.`}
        <br />
        변경하려면 참여자 관리에서 명단을 비워 주세요.
      </Callout.Description>
    </Callout.Root>
  );
}
