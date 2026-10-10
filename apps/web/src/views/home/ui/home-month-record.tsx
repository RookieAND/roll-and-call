import { RANKING_MODE } from "@roll-and-call/database/servers/model";
import { HStack, Text } from "@roll-and-call/ui";
import type { Dayjs } from "dayjs";

import type { MonthRecord } from "../model/build-month-record";
import { HomeRecordEmpty } from "./home-record-empty";
import { HomeRecordGuide } from "./home-record-guide";
import { HomeRecordRanking } from "./home-record-ranking";
import { HomeRecordSection } from "./home-record-section";

const LABELS = {
  [RANKING_MODE.count]: { gm: "GM으로 운영한 세션 수", player: "플레이어로 참여한 세션 수" },
  [RANKING_MODE.points]: { gm: "GM으로 얻은 점수", player: "플레이어로 얻은 점수" },
};

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
  const points = record.mode === RANKING_MODE.points;
  const { gm: GM_LABEL, player: PLAYER_LABEL } = LABELS[record.mode];
  const topGm = record.gms.leaders[0];
  const topPlayer = record.players.leaders[0];

  return (
    <section className="border-t border-gray-200 px-200 pt-225 pb-250">
      <HStack align="center" gap="050">
        <Text typography="heading2" render={<h3 />} className="font-extrabold">
          {monthLabel}의 기록
        </Text>
        {points && <HomeRecordGuide />}
      </HStack>
      <Text typography="body4" foreground="hint" render={<p />} className="mt-050 mb-200">
        {summary}
      </Text>

      <HomeRecordSection label={GM_LABEL}>
        {topGm ? (
          <HomeRecordRanking
            label={GM_LABEL}
            ranking={record.gms}
            first={topGm}
            mode={record.mode}
          />
        ) : (
          <HomeRecordEmpty
            image="empty-month-record"
            title="아직 세션을 마친 GM이 없습니다"
            description="세션이 완료될 때마다 집계합니다."
          />
        )}
      </HomeRecordSection>

      <HomeRecordSection label={PLAYER_LABEL} className="mt-200 border-t border-gray-100 pt-200">
        {topPlayer ? (
          <HomeRecordRanking
            label={PLAYER_LABEL}
            ranking={record.players}
            first={topPlayer}
            mode={record.mode}
          />
        ) : (
          <HomeRecordEmpty
            image="empty-month-record"
            title="아직 참여를 마친 사람이 없습니다"
            description="무산된 세션은 세지 않습니다."
          />
        )}
      </HomeRecordSection>
    </section>
  );
}
