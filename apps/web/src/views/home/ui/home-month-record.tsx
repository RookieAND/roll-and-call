import { Text } from "@trpg/ui";
import type { Dayjs } from "dayjs";

import type { MonthRecord } from "../model/build-month-record";
import { HomeRecordGroup } from "./home-record-group";

interface HomeMonthRecordProps {
  monthStart: Dayjs;
  record: MonthRecord;
}

export function HomeMonthRecord({ monthStart, record }: HomeMonthRecordProps) {
  const monthLabel = monthStart.format("M월");
  const summary =
    record.sessionCount > 0
      ? `이 달에 끝난 세션 ${record.sessionCount}건을 셌습니다.`
      : "아직 이 달에 끝난 세션이 없습니다.";

  return (
    <section className="border-t border-gray-200 px-200 pt-225 pb-250">
      <Text typography="heading2" render={<h3 />} className="font-extrabold">
        {monthLabel}의 기록
      </Text>
      <Text typography="body4" foreground="hint" render={<p />} className="mt-050 mb-200">
        {summary}
      </Text>
      <HomeRecordGroup
        label="GM으로 운영한 세션 수"
        ranking={record.gms}
        emptyTitle="아직 세션을 마친 GM이 없습니다"
        emptyDescription="세션이 완료될 때마다 집계합니다."
      />
      <HomeRecordGroup
        label="플레이어로 참여한 세션 수"
        ranking={record.players}
        emptyTitle="아직 참여를 마친 사람이 없습니다"
        emptyDescription="무산된 세션은 세지 않습니다."
        className="mt-200 border-t border-gray-100 pt-200"
      />
    </section>
  );
}
