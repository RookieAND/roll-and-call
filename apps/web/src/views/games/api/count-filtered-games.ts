"use server";

import { isString } from "es-toolkit";

import {
  GAME_STATUS_FILTER_DEFAULT,
  parseGameFilters,
  parseGameStatusFilter,
  parseGameTab,
} from "@/shared/api";
import { getCurrentServer, getGamesCounts } from "@/shared/server";

import { statusCounts } from "../model/status-counts";

type FilterParamKey = "q" | "tab" | "status" | "rule" | "day" | "time" | "unscheduled";

// 필터 시트의 [N건 보기] 숫자. 주소 값과 같은 모양으로 받아 서버에서 다시 검사한다(클라이언트 값을 믿지 않는다).
export async function countFilteredGames({
  filter,
}: {
  filter: Partial<Record<FilterParamKey, unknown>>;
}): Promise<number> {
  const text = (value: unknown) => (isString(value) ? value : undefined);
  const server = await getCurrentServer();
  const tab = parseGameTab(text(filter.tab));
  const status = parseGameStatusFilter({ value: text(filter.status), tab });
  const counts = await getGamesCounts({
    serverId: server.id,
    q: text(filter.q)?.trim() || undefined,
    filter: parseGameFilters({
      rule: text(filter.rule),
      day: text(filter.day),
      time: text(filter.time),
      unscheduled: text(filter.unscheduled),
    }),
  });
  return statusCounts({ counts, tab })[status ?? GAME_STATUS_FILTER_DEFAULT] ?? 0;
}
