import { Callout } from "@roll-and-call/ui";

interface LockedModeNoticeProps {
  label: string;
  particle?: "은" | "는";
}

export function LockedModeNotice({ label, particle = "은" }: LockedModeNoticeProps) {
  return (
    <Callout.Root colorPalette="gray" size="sm">
      <Callout.Icon />
      <Callout.Description>
        {`신청자가 있어 ${label}${particle} 바꿀 수 없습니다.`}
        <br />
        변경하려면 참여자 관리에서 「내보내기」로 모두 내보내야 합니다.
      </Callout.Description>
    </Callout.Root>
  );
}
