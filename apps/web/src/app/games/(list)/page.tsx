import { parseGameSort, parseGameStatusFilter } from "@/shared/api";
import { GamesView } from "@/views/games";
export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    sort?: string;
    status?: string;
  }>;
}) {
  const { page, q, sort, status } = await searchParams;
  return (
    <GamesView
      page={Number(page) || 1}
      filter={{ q, sort: parseGameSort(sort), status: parseGameStatusFilter(status) }}
    />
  );
}
