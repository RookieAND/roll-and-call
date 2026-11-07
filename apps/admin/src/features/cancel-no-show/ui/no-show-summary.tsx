import { Text, VStack } from "@roll-and-call/ui";

import { NO_SHOW_STATUS } from "@/entities/no-show";
import type { NoShowDetail } from "@/entities/no-show/server";
import { formatFullDateTime, formatFullSessionTime } from "@/shared/lib";
import { FactSub } from "@/shared/ui";

import { SummaryGroup } from "./summary-group";

const REPEATED_NO_SHOW_COUNT = 2;

const COUNT_SUB = {
  [NO_SHOW_STATUS.valid]: "이 기록 포함",
  [NO_SHOW_STATUS.expired]: null,
  [NO_SHOW_STATUS.cancelled]: "이 기록 제외",
} as const;

interface NoShowSummaryProps {
  record: NoShowDetail;
}

export function NoShowSummary({ record }: NoShowSummaryProps) {
  const countSub = COUNT_SUB[record.status];
  const countForeground = record.recentNoShowCount >= REPEATED_NO_SHOW_COUNT ? "danger" : "normal";
  const reasonRow = record.added
    ? {
        label: "추가 사유",
        value: (
          <>
            {record.added.reason}
            <FactSub>운영진 기록</FactSub>
          </>
        ),
      }
    : { label: "GM이 남긴 사유", value: record.gmReason ?? "없음" };
  return (
    <VStack
      gap="125"
      className="divide-y divide-(--rc-color-border-subtle) rounded-400 border border-gray-200 px-175 py-050"
    >
      <SummaryGroup
        title="불참 내용"
        items={[
          { label: "불참 당사자", value: record.nickname },
          { label: "처리한 사람", value: record.handler },
          reasonRow,
        ]}
      />
      <SummaryGroup
        title="세션"
        items={[
          { label: "세션", value: record.sessionTitle },
          { label: "룰북", value: record.rulebook },
          { label: "일시", value: formatFullSessionTime(record.startsAt), nowrap: true },
        ]}
      />
      {record.cancellation ? (
        <SummaryGroup
          title="취소 내용"
          items={[
            { label: "취소 사유", value: record.cancellation.reason },
            {
              label: "취소한 운영진",
              value: `${record.cancellation.by} · ${formatFullDateTime(record.cancellation.at)}`,
            },
          ]}
        />
      ) : null}
      <SummaryGroup
        title="최근 30일 불참"
        items={[
          {
            label: "최근 30일 불참",
            value: (
              <>
                <Text
                  typography="body3"
                  weight="medium"
                  foreground={countForeground}
                  render={<span />}
                >
                  {record.recentNoShowCount}회
                </Text>
                {countSub ? <FactSub>{countSub}</FactSub> : null}
              </>
            ),
            nowrap: true,
          },
        ]}
      />
    </VStack>
  );
}
