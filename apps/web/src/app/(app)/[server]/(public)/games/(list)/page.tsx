import type { Metadata } from "next";

import { parseGameFilters, parseGameSort, parseGameStatusFilter, parseGameTab } from "@/shared/api";
import { GamesView } from "@/views/games";

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
    unscheduled?: string;
  }>;
}) {
  const { page, q, sort, tab, status, rule, day, time, unscheduled } = await searchParams;
  const gameTab = parseGameTab(tab);
  return (
    <GamesView
      page={Number(page) || 1}
      filter={{
        q,
        sort: parseGameSort(sort),
        tab: gameTab,
        status: parseGameStatusFilter({ value: status, tab: gameTab }),
        ...parseGameFilters({ rule, day, time, unscheduled }),
      }}
    />
  );
}
