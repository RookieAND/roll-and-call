import { Text, VStack } from "@trpg/ui";
import { AlertCircle } from "lucide-react";

import { ABSENCE_RECORD_MONTHS } from "@/entities/game";
import { formatDate } from "@/shared/lib";
import type { Absence } from "@/widgets/session-list";

// 판단에 필요한 만큼만 보인다 — 횟수와 가장 최근 한 건. 전체 목록을 펼치는 것은 낙인이다.
export function ProfileAbsenceNotice({ absences }: { absences: Absence[] }) {
  const latest = absences[0];
  if (!latest) {
    return (
      <Text typography="body4" foreground="hint" render={<p />}>
        최근 {ABSENCE_RECORD_MONTHS}개월 불참 없음.
      </Text>
    );
  }

  return (
    <VStack gap={2}>
      <div className="flex items-start gap-2.5 rounded-500 border border-danger-200 bg-danger-50 px-3.5 py-3">
        <AlertCircle
          size={15}
          strokeWidth={2.2}
          aria-hidden
          className="mt-px shrink-0 text-danger-600"
        />
        <div className="min-w-0 flex-1">
          <Text typography="subtitle1" foreground="danger" render={<p />}>
            최근 {ABSENCE_RECORD_MONTHS}개월 불참 {absences.length}회
          </Text>
          <Text
            typography="body4"
            foreground="muted"
            render={<p />}
            className="mt-1 leading-relaxed"
          >
            {formatDate(latest.sessionAt)} {latest.title}.
            <br />
            {formatDate(latest.expiresAt)}에 사라집니다.
          </Text>
        </div>
      </div>
      <Text typography="body4" foreground="hint" render={<p />} className="leading-relaxed">
        신청을 막지는 않습니다. 받을지는 GM이 정합니다.
      </Text>
    </VStack>
  );
}
