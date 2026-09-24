import type { Metadata } from "next";

import { getNoShow, listNoShows, type NoShowFilter } from "@/shared/server";
import { NoShowsView } from "@/views/no-shows";

export const metadata: Metadata = { title: "불참 기록" };

export default async function NoShowsPage({ searchParams }: PageProps<"/noshow">) {
  const { q, timing, status, record } = (await searchParams) as Record<string, string | undefined>;
  const rows = await listNoShows({
    query: q,
    timing: timing as NoShowFilter["timing"],
    status: status as NoShowFilter["status"],
  });
  const detail = record ? await getNoShow(record) : null;
  return <NoShowsView rows={rows} record={detail} query={{ q, timing, status }} />;
}
