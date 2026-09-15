import { Text } from "@trpg/ui";
import type { Dayjs } from "dayjs";

import { EmptyState } from "@/shared/ui";

import type { MonthRecord } from "../model/build-month-record";
import { HomeRecordColumn } from "./home-record-column";

export function HomeMonthRecord({
  monthStart,
  record,
}: {
  monthStart: Dayjs;
  record: MonthRecord;
}) {
  const monthLabel = monthStart.format("M월");
  const summary =
    record.finishedCount > 0
      ? `이 달에 끝난 세션 ${record.finishedCount}건을 셌습니다.`
      : "아직 이 달에 끝난 세션이 없습니다.";

  return (
    <section className="border-t border-gray-200 px-4 pt-[18px] pb-5">
      <Text typography="heading2" render={<h3 />} className="font-extrabold">
        {monthLabel}의 기록
      </Text>
      <Text
        typography="body4"
        foreground="hint"
        render={<p />}
        className="mt-1 mb-3.5 text-[12.5px]"
      >
        {summary}
      </Text>
      {record.finishedCount === 0 ? (
        <EmptyState
          size="section"
          className="p-5"
          title={`${monthLabel}이 끝나면 여기에 세 명이 남습니다`}
          description={
            <>
              세션이 완료될 때마다 집계합니다.
              <br />
              무산된 세션은 세지 않습니다.
            </>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          <HomeRecordColumn title="GM" caption="연 세션" rows={record.gms} />
          <HomeRecordColumn title="플레이어" caption="참여한 세션" rows={record.players} />
        </div>
      )}
    </section>
  );
}
