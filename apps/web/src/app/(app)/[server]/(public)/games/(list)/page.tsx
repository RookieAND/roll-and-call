import { isFeatureEnabled } from "@roll-and-call/app-kit/feature-flags";
import type { Metadata } from "next";

import {
  GamesView,
  parseGameFilters,
  parseGameSort,
  parseGameStatusFilter,
  parseGameTab,
} from "@/views/games";

export const metadata: Metadata = { title: "구인 목록" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    sort?: string;
    tab?: string;
    status?: string;
    rule?: string;
    day?: string;
    time?: string;
    rounds?: string;
    unscheduled?: string;
    designated?: string;
  }>;
}) {
  const { page, q, sort, tab, status, rule, day, time, rounds, unscheduled, designated } =
    await searchParams;
  const showRounds = isFeatureEnabled("multiRound");
  const gameTab = parseGameTab(tab);
  return (
    <GamesView
      page={Number(page) || 1}
      showRounds={showRounds}
      filter={{
        q,
        sort: parseGameSort(sort),
        tab: gameTab,
        status: parseGameStatusFilter({ value: status, tab: gameTab }),
        ...parseGameFilters({
          rule,
          day,
          time,
          rounds: showRounds ? rounds : undefined,
          unscheduled,
          designated,
        }),
      }}
    />
  );
}
