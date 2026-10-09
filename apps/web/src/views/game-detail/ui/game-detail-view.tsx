import { notFound } from "next/navigation";

import {
  canViewHiddenGame,
  isGameGm,
  isSessionEnded,
  PARTICIPANT_STATUS,
  splitRoster,
} from "@/entities/game";
import { QUERY_NOTICE } from "@/shared/lib";
import {
  findActiveSanction,
  getCurrentSessionUser,
  getGameById,
  getCurrentServer,
  getReviewDraftTarget,
} from "@/shared/server";
import { QueryNoticeToast } from "@/shared/ui";
import {
  GameDetail,
  isRecruitmentClosed,
  REVIEW_STATUS,
  reviewStatusOf,
} from "@/widgets/game-detail";

import { GameHiddenView } from "./game-hidden-view";

const NOTICE_MESSAGES = {
  [QUERY_NOTICE.noDrawResult]: "추첨 결과가 없는 구인입니다",
};

interface GameDetailViewProps {
  id: string;
}

export async function GameDetailView({ id }: GameDetailViewProps) {
  const server = await getCurrentServer();
  const [game, user] = await Promise.all([getGameById(server.id, id), getCurrentSessionUser()]);
  if (!game) notFound();
  const viewerId = user?.id ?? null;
  if (!canViewHiddenGame({ game, viewerId })) return <GameHiddenView />;

  const now = new Date();
  const participant = game.participants.find((row) => row.userId === viewerId);
  const confirmedCount = splitRoster(game.participants).confirmed.length;
  const open = !game.cancelledAt && !isRecruitmentClosed({ game, confirmedCount, now });
  // 제재는 참여 기록이 없고 모집이 열려 있을 때, 후기는 확정자의 세션이 끝났을 때만 읽는다.
  const needsSanction =
    viewerId && !participant && open && !isGameGm({ gmId: game.gmId, userId: viewerId });
  const needsReview =
    viewerId && participant?.status === PARTICIPANT_STATUS.confirmed && isSessionEnded(game, now);
  const [sanction, reviewTarget] = await Promise.all([
    needsSanction ? findActiveSanction({ serverId: server.id, userId: viewerId, now }) : null,
    needsReview
      ? getReviewDraftTarget({ serverId: server.id, gameId: id, userId: viewerId })
      : null,
  ]);
  const review = needsReview ? reviewStatusOf(reviewTarget, now) : REVIEW_STATUS.unavailable;

  return (
    <>
      <GameDetail game={game} viewerId={viewerId} sanction={sanction} review={review} now={now} />
      <QueryNoticeToast messages={NOTICE_MESSAGES} />
    </>
  );
}
