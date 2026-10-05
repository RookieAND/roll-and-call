import { HStack, Text } from "@roll-and-call/ui";
import type { Dayjs } from "dayjs";

import { ScoreRuleLink } from "@/entities/badge";

import type { MonthRecord } from "../model/build-month-record";
import { HomeRecordEmpty } from "./home-record-empty";
import { HomeRecordRanking } from "./home-record-ranking";
import { HomeRecordSection } from "./home-record-section";

const GM_LABEL = "GM 점수";
const PLAYER_LABEL = "플레이어 점수";

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
  const [topGm, ...otherGms] = record.gms.leaders;
  const [topPlayer, ...otherPlayers] = record.players.leaders;

  return (
    <section className="border-t border-gray-200 px-200 pt-225 pb-250">
      <HStack align="center">
        <Text typography="heading2" render={<h3 />} className="font-extrabold">
          {monthLabel}의 기록
        </Text>
        <ScoreRuleLink className="-my-150 -ml-100" />
      </HStack>
      <Text typography="body4" foreground="hint" render={<p />} className="mt-050 mb-200">
        {summary}
      </Text>

      <HomeRecordSection label={GM_LABEL}>
        {topGm ? (
          <HomeRecordRanking
            label={GM_LABEL}
            leaders={[topGm, ...otherGms]}
            runnersUp={record.gms.runnersUp}
          />
        ) : (
          <HomeRecordEmpty
            title="아직 세션을 마친 GM이 없습니다"
            description="세션이 완료될 때마다 집계합니다."
          />
        )}
      </HomeRecordSection>

      <HomeRecordSection label={PLAYER_LABEL} className="mt-200 border-t border-gray-100 pt-200">
        {topPlayer ? (
          <HomeRecordRanking
            label={PLAYER_LABEL}
            leaders={[topPlayer, ...otherPlayers]}
            runnersUp={record.players.runnersUp}
          />
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
