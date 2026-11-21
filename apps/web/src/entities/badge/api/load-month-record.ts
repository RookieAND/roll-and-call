import {
  listRankingHiddenUserIds,
  loadMonthMultiRoundRows,
  loadReviewAppearances,
} from "@roll-and-call/database/badges";
import { getMonthSessions } from "@roll-and-call/database/games";
import { RANKING_MODE, type RankingMode } from "@roll-and-call/database/servers/model";

import { buildMonthRecord } from "../model/build-month-record";

interface LoadMonthRecordParams {
  serverId: string;
  rankingMode: RankingMode;
  from: Date;
  to: Date;
  now: Date;
}

export async function loadMonthRecord({
  serverId,
  rankingMode,
  from,
  to,
  now,
}: LoadMonthRecordParams) {
  const [rows, multiRoundRows, reviews, hiddenUserIds] = await Promise.all([
    getMonthSessions({ serverId, from, to }),
    loadMonthMultiRoundRows({ serverId, from, to }),
    rankingMode === RANKING_MODE.points ? loadReviewAppearances({ serverId, from, to }) : [],
    listRankingHiddenUserIds({ serverId }),
  ]);
  return buildMonthRecord({
    rows: [...rows.filter((row) => row.roundCount === 1), ...multiRoundRows],
    now,
    mode: rankingMode,
    reviews,
    hiddenUserIds,
  });
}
