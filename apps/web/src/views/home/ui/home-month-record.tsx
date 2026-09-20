import { Text } from "@trpg/ui";
import type { Dayjs } from "dayjs";

import type { MonthRecord } from "../model/build-month-record";
import { HomeRecordGroup } from "./home-record-group";

export function HomeMonthRecord({
  monthStart,
  record,
}: {
  monthStart: Dayjs;
  record: MonthRecord;
}) {
  const monthLabel = monthStart.format("M월");
  const summary =
    record.sessionCount > 0
      ? `이 달에 개설된 세션 ${record.sessionCount}건을 토대로 산정한 순위입니다.`
      : "아직 이 달에 개설된 세션이 없습니다.";

  return (
    <section className="border-t border-gray-200 px-4 pt-4.5 pb-5">
      <Text typography="heading2" render={<h3 />} className="font-extrabold">
        {monthLabel}의 기록
      </Text>
      <Text typography="body4" foreground="hint" render={<p />} className="mt-1 mb-4">
        {summary}
      </Text>
      <HomeRecordGroup
        label="GM으로 운영한 세션 수"
        ranking={record.gms}
        emptyTitle="아직 세션을 연 GM이 없습니다"
        emptyDescription="세션이 개설될 때마다 집계합니다."
      />
      <HomeRecordGroup
        label="플레이어로 참여한 세션 수"
        ranking={record.players}
        emptyTitle="아직 참여가 확정된 사람이 없습니다"
        emptyDescription="무산된 세션은 세지 않습니다."
        className="mt-4 border-t border-gray-100 pt-4"
      />
    </section>
  );
}
