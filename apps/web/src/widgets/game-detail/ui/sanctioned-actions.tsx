import { sanctionLines } from "@/entities/sanction";

import { ActionNotice } from "./action-notice";

interface SanctionedActionsProps {
  reason: string;
  until: Date | null;
}

export function SanctionedActions({ reason, until }: SanctionedActionsProps) {
  return (
    <ActionNotice
      title="활동 정지 기간에는 신청할 수 없습니다"
      lines={sanctionLines({ reason, until })}
      colorPalette="warning"
    />
  );
}
