import { loadParticipationStanding } from "@roll-and-call/database/badges";
import { findActiveSanction } from "@roll-and-call/database/moderation";
import { getReviewDraftTarget } from "@roll-and-call/database/reviews";
import { notFound } from "next/navigation";

import {
  canViewHiddenGame,
  isGameGm,
  isSessionEnded,
  PARTICIPANT_STATUS,
  splitRoster,
} from "@/entities/game";
import { MemberTitleSheetsProvider } from "@/features/view-badge";
import { loadMemberTitleSheets } from "@/features/view-badge/server";
import { QUERY_NOTICE } from "@/shared/lib";
import { getCurrentSessionUser, getGameById, getCurrentServer } from "@/shared/server";
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
  // 제재는 참여 기록이 없고 모집이 열려 있을 때, 후기는 확정자·GM의 세션이 끝났을 때만 읽는다.
  const needsSanction =
    viewerId && !participant && open && !isGameGm({ gmId: game.gmId, userId: viewerId });
  const takesPartInGame =
    participant?.status === PARTICIPANT_STATUS.confirmed ||
    isGameGm({ gmId: game.gmId, userId: viewerId });
  const needsReview = viewerId && takesPartInGame && isSessionEnded(game, now);
  // 참여 조건은 신청을 고민하는 사람(참여 기록 없는 로그인 사용자)에게만 내 현황과 견준다.
  const needsStanding = needsSanction && (game.minRulePlays !== null || game.requireRulebookCert);
  const [sanction, standing, reviewTarget, titleSheets] = await Promise.all([
    needsSanction ? findActiveSanction({ serverId: server.id, userId: viewerId, now }) : null,
    needsStanding
      ? loadParticipationStanding({
          serverId: server.id,
          userId: viewerId,
          rule: game.rule,
          rulebookId: game.rulebookId,
        })
      : null,
    needsReview
      ? getReviewDraftTarget({ serverId: server.id, gameId: id, userId: viewerId })
      : null,
    loadMemberTitleSheets({
      serverId: server.id,
      userIds: [game.gmId, ...game.participants.map((row) => row.userId)],
      now,
    }),
  ]);
  const review = needsReview ? reviewStatusOf(reviewTarget, now) : REVIEW_STATUS.unavailable;

  return (
    <MemberTitleSheetsProvider sheets={titleSheets}>
      <GameDetail
        game={game}
        viewerId={viewerId}
        sanction={sanction}
        standing={standing}
        review={review}
        now={now}
      />
      <QueryNoticeToast messages={NOTICE_MESSAGES} />
    </MemberTitleSheetsProvider>
  );
}
