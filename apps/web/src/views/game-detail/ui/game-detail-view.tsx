import { notFound } from "next/navigation";

import { QUERY_NOTICE } from "@/shared/lib";
import { getCurrentSessionUser, getGameById, getCurrentServer } from "@/shared/server";
import { QueryNoticeToast } from "@/shared/ui";

import { GameDetail } from "./game-detail";

const NOTICE_MESSAGES = {
  [QUERY_NOTICE.noDrawResult]: "추첨 결과가 없는 구인입니다",
};

export async function GameDetailView({ id }: { id: string }) {
  const server = await getCurrentServer();
  const [game, user] = await Promise.all([getGameById(server.id, id), getCurrentSessionUser()]);
  if (!game) notFound();

  return (
    <>
      <GameDetail game={game} viewerId={user?.id ?? null} />
      <QueryNoticeToast messages={NOTICE_MESSAGES} />
    </>
  );
}
