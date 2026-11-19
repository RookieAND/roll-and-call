import { RANKING_MODE, type RankingMode } from "@roll-and-call/database/servers/model";

import { recordUnit } from "./home-record-unit";

export const formatRecordCount = (count: number, mode: RankingMode) =>
  mode === RANKING_MODE.points ? `${count}${recordUnit(mode)}` : `참여 ${count}${recordUnit(mode)}`;
