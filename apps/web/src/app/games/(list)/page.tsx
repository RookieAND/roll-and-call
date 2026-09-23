import type { Metadata } from "next";

import { parseGameSort, parseGameStatusFilter, parseGameTab } from "@/shared/api";
import { GamesView } from "@/views/games";
export const dynamic = "force-dynamic";
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
  }>;
}) {
  const { page, q, sort, tab, status } = await searchParams;
  const gameTab = parseGameTab(tab);
  return (
    <GamesView
      page={Number(page) || 1}
      filter={{
        q,
        sort: parseGameSort(sort),
        tab: gameTab,
        status: parseGameStatusFilter({ value: status, tab: gameTab }),
      }}
    />
  );
}
