import { Callout } from "@roll-and-call/ui";
import { AlertCircle } from "lucide-react";

import { ABSENCE_RECORD_MONTHS } from "@/entities/game";
import type { Absence } from "@/widgets/session-list";

interface ProfileAbsenceNoticeProps {
  absences: Absence[];
}

// 불참이 없으면 아무것도 보이지 않는다. 있을 때도 횟수·목록은 펼치지 않는다 — 낙인이 된다.
export function ProfileAbsenceNotice({ absences }: ProfileAbsenceNoticeProps) {
  if (absences.length === 0) return null;

  return (
    <Callout.Root colorPalette="danger">
      <Callout.Icon>
        <AlertCircle size={15} strokeWidth={2.2} />
      </Callout.Icon>
      <Callout.Title>{`최근 ${ABSENCE_RECORD_MONTHS}개월 내 세션 불참 이력이 있습니다`}</Callout.Title>
      <Callout.Description>구인 등록 및 세션 참여 신청 시 패널티가 부과됩니다.</Callout.Description>
    </Callout.Root>
  );
}
