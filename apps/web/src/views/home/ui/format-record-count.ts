import type { RankingMode } from "@roll-and-call/database/servers/model";

import { recordUnit } from "./home-record-unit";

export const formatRecordCount = (count: number, mode: RankingMode) =>
  `${count}${recordUnit(mode)}`;
