import { Callout, Text, VStack } from "@trpg/ui";
import { AlertCircle } from "lucide-react";

import { ABSENCE_RECORD_MONTHS } from "@/entities/game";
import { formatDate } from "@/shared/lib";
import type { Absence } from "@/widgets/session-list";

interface ProfileAbsenceNoticeProps {
  absences: Absence[];
}

// 판단에 필요한 만큼만 보인다 — 횟수와 가장 최근 한 건. 전체 목록을 펼치는 것은 낙인이다.
export function ProfileAbsenceNotice({ absences }: ProfileAbsenceNoticeProps) {
  const latest = absences[0];
  if (!latest) {
    return (
      <Text typography="body4" foreground="hint" render={<p />}>
        최근 {ABSENCE_RECORD_MONTHS}개월 불참 없음.
      </Text>
    );
  }

  return (
    <VStack gap="100">
      <Callout
        tone="danger"
        icon={<AlertCircle size={15} strokeWidth={2.2} />}
        title={`최근 ${ABSENCE_RECORD_MONTHS}개월 불참 ${absences.length}회`}
      >
        {formatDate(latest.sessionAt)} {latest.title}.
        <br />
        {formatDate(latest.expiresAt)}에 사라집니다.
      </Callout>
      <Text typography="body4" foreground="hint" render={<p />} className="leading-relaxed">
        신청을 막지는 않습니다. 받을지는 GM이 정합니다.
      </Text>
    </VStack>
  );
}
