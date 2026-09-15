import { Text } from "@trpg/ui";

import type { getRecruitingGamesPage } from "@/shared/server";

type GamesPage = Awaited<ReturnType<typeof getRecruitingGamesPage>>;

export async function GamesCount({
  promise,
  searching,
}: {
  promise: Promise<GamesPage>;
  searching: boolean;
}) {
  const { total } = await promise;
  const label = searching ? `검색 결과 ${total}건` : `${total}건`;
  return (
    <Text typography="body2" foreground="muted">
      {label}
    </Text>
  );
}
