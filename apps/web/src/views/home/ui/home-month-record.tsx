import { Text } from "@roll-and-call/ui";
import type { Dayjs } from "dayjs";

import type { MonthRecord } from "../model/build-month-record";
import { HomeRecordEmpty } from "./home-record-empty";
import { HomeRecordRanking } from "./home-record-ranking";
import { HomeRecordSection } from "./home-record-section";

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
  const topGm = record.gms.leaders[0];
  const topPlayer = record.players.leaders[0];

  return (
    <section className="border-t border-gray-200 px-200 pt-225 pb-250">
      <Text typography="heading2" render={<h3 />} className="font-extrabold">
        {monthLabel}의 기록
      </Text>
      <Text typography="body4" foreground="hint" render={<p />} className="mt-050 mb-200">
        {summary}
      </Text>

      <HomeRecordSection label="GM으로 운영한 세션 수">
        {topGm ? (
          <HomeRecordRanking ranking={record.gms} first={topGm} />
        ) : (
          <HomeRecordEmpty
            title="아직 세션을 마친 GM이 없습니다"
            description="세션이 완료될 때마다 집계합니다."
          />
        )}
      </HomeRecordSection>

      <HomeRecordSection
        label="플레이어로 참여한 세션 수"
        className="mt-200 border-t border-gray-100 pt-200"
      >
        {topPlayer ? (
          <HomeRecordRanking ranking={record.players} first={topPlayer} />
        ) : (
          <HomeRecordEmpty
            title="아직 참여를 마친 사람이 없습니다"
            description="무산된 세션은 세지 않습니다."
          />
        )}
      </HomeRecordSection>
    </section>
  );
}
