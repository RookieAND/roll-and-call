import { Text } from "@trpg/ui";
import type { Dayjs } from "dayjs";

import { EmptyState } from "@/shared/ui";

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
      ? `이 달에 개설된 세션 ${record.sessionCount}건을 셌습니다.`
      : "아직 이 달에 개설된 세션이 없습니다.";

  return (
    <section className="border-t border-gray-200 px-4 pt-[18px] pb-5">
      <Text typography="heading2" render={<h3 />} className="font-extrabold">
        {monthLabel}의 기록
      </Text>
      <Text typography="body4" foreground="hint" render={<p />} className="mt-1 mb-4 text-[12.5px]">
        {summary}
      </Text>
      {record.sessionCount === 0 ? (
        <EmptyState
          size="section"
          className="p-5"
          title={`${monthLabel}에 세션이 열리면 GM과 플레이어 1위가 여기 섭니다`}
          description={
            <>
              세션이 개설될 때마다 집계합니다.
              <br />
              무산된 세션은 세지 않습니다.
            </>
          }
        />
      ) : (
        <>
          <HomeRecordGroup label="GM · 연 세션" rows={record.gms} />
          <HomeRecordGroup
            label="플레이어 · 참여한 세션"
            rows={record.players}
            className="mt-4 border-t border-gray-100 pt-[15px]"
          />
        </>
      )}
    </section>
  );
}
