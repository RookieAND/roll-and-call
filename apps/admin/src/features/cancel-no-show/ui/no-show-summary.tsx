import { Button } from "@roll-and-call/ui";
import { Calendar } from "lucide-react";
import Link from "next/link";

import { formatSessionTime } from "@/shared/lib";
import { NO_SHOW_TIMINGS, type NoShowDetail } from "@/shared/server";
import { EntityHead, IconTile } from "@/shared/ui";

const REPEATED_NO_SHOW_COUNT = 2;

interface NoShowSummaryProps {
  record: NoShowDetail;
}

export function NoShowSummary({ record }: NoShowSummaryProps) {
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
          label: "당사자의 최근 3개월 불참",
          value: `${record.recentNoShowCount}회`,
          danger: record.recentNoShowCount >= REPEATED_NO_SHOW_COUNT,
          sub: record.cancelled ? undefined : "이 기록 포함",
        },
      ]}
      actions={
        <Button
          variant="outline"
          colorPalette="gray"
          size="sm"
          render={<Link href={`/users/${record.userId}?tab=noshow`} />}
        >
          {record.nickname}의 불참 기록 전체 보기
        </Button>
      }
    />
  );
}
