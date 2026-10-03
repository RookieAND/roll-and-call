import { isAbsenceActive } from "@roll-and-call/database/games/model";
import { Button } from "@roll-and-call/ui";
import { Calendar } from "lucide-react";

import { formatSessionTime } from "@/shared/lib";
import { NO_SHOW_TIMINGS, type NoShowDetail } from "@/shared/server";
import { EntityHead, IconTile, ServerLink } from "@/shared/ui";

const REPEATED_NO_SHOW_COUNT = 2;

interface NoShowSummaryProps {
  record: NoShowDetail;
}

export function NoShowSummary({ record }: NoShowSummaryProps) {
  const counted =
    !record.cancelled && isAbsenceActive({ sessionStartsAt: record.startsAt, now: Date.now() });
  return (
    <EntityHead
      lead={<IconTile icon={Calendar} size="lg" />}
      title={record.sessionTitle}
      meta={`${formatSessionTime(record.startsAt)} · ${record.rulebook} · GM ${record.gmNickname}`}
      facts={[
        { label: "불참 당사자", value: record.nickname },
        { label: "처리한 GM", value: record.gmNickname },
        { label: "처리 시점", value: NO_SHOW_TIMINGS[record.timing] },
        {
          label: "당사자의 최근 30일 불참",
          value: `${record.recentNoShowCount}회`,
          danger: record.recentNoShowCount >= REPEATED_NO_SHOW_COUNT,
          sub: counted ? "이 기록 포함" : undefined,
        },
      ]}
      actions={
        <Button
          variant="outline"
          colorPalette="gray"
          size="sm"
          render={<ServerLink path={`/users/${record.userId}?tab=noshow`} />}
        >
          {record.nickname}의 불참 기록 전체 보기
        </Button>
      }
    />
  );
}
