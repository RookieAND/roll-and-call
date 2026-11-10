import { getResponseCounts } from "@roll-and-call/database/games";
import { getGameReviews, getReviewDraftTarget } from "@roll-and-call/database/reviews";
import { Badge, Card, Container, HStack, Text } from "@roll-and-call/ui";
import { isNil } from "es-toolkit";
import { notFound } from "next/navigation";

import {
  GAME_CANCEL_KIND,
  gameCancelledRecipients,
  isSessionEnded,
  MANAGE_STAGE_LABEL,
  MANAGE_STAGE_TONE,
  plannedEndAt,
} from "@/entities/game";
import { GmOnlyNotice } from "@/features/auth";
import { CancelGameRow } from "@/features/cancel-game";
import { canReopenGame } from "@/features/reopen-game";
import { getCurrentSessionUser, getGameById, getCurrentServer } from "@/shared/server";
import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";
import { reviewStatusOf } from "@/widgets/game-detail";

import { cancelRowDetail } from "../model/cancel-row-detail";
import { cancelRowLock } from "../model/cancel-row-lock";
import { manageReviewButtonOf } from "../model/manage-review-button-of";
import { manageRowGroups } from "../model/manage-rows";
import { manageSummary } from "../model/manage-summary";
import { manageTimeline } from "../model/manage-timeline";
import { ManageCancelNote } from "./manage-cancel-note";
import { ManageDeadlineLine } from "./manage-deadline-line";
import { ManageGameStat } from "./manage-game-stat";
import { ManageGroup } from "./manage-group";
import { ManageReopenSection } from "./manage-reopen-section";
import { ManageRow } from "./manage-row";
import { ManageTimeline } from "./manage-timeline";

interface ManageGameViewProps {
  id: string;
}

const SCHEDULE_LABEL = "세션 일시";
const SCHEDULE_KEY_LABELS = [SCHEDULE_LABEL, "확정 인원"];
const ATTENDANCE_LABEL = "출석";

export async function ManageGameView({ id }: ManageGameViewProps) {
  const server = await getCurrentServer();
  const [game, user, responseCounts, reviews] = await Promise.all([
    getGameById(server.id, id),
    getCurrentSessionUser(),
    getResponseCounts({ serverId: server.id, gameIds: [id] }),
    getCurrentSessionUser().then((viewer) =>
      getGameReviews({ serverId: server.id, gameId: id, viewerId: viewer?.id ?? null }).then(
        ({ participantReviews }) => participantReviews,
      ),
    ),
  ]);
  if (!game) notFound();
  if (user?.id !== game.gmId) {
    return (
      <PageShell appBar={<AppBar back={`/games/${id}`} title="운영 관리" />}>
        <Container size="sm" className="py-300 desktop:px-0 desktop:py-0 desktop:max-w-none">
          <GmOnlyNotice
            gameId={id}
            signedIn={!!user}
            description="이 구인글의 운영 관리는 GM만 열 수 있습니다."
          />
        </Container>
      </PageShell>
    );
  }
  const responses = responseCounts.get(id) ?? 0;
  const notifyCount = gameCancelledRecipients({
    game,
    kind: GAME_CANCEL_KIND.gm,
    roster: game.participants,
  }).length;
  const { stage, stats, cancelNote, deadlineNote } = manageSummary({ game, responses });
  const summaryStats = stats.some((stat) => stat.label === SCHEDULE_LABEL)
    ? stats.filter((stat) => SCHEDULE_KEY_LABELS.includes(stat.label))
    : stats;
  const canReopen = canReopenGame({ game, userId: user.id, serverId: server.id });
  const reviewTarget = await getReviewDraftTarget({
    serverId: server.id,
    gameId: id,
    userId: user.id,
  });
  const gmReview = manageReviewButtonOf(reviewStatusOf(reviewTarget));
  const groups = manageRowGroups({ game, reviewCount: reviews.length, gmReview });
  const timeline = manageTimeline({
    game,
    attendance: stats.find((stat) => stat.label === ATTENDANCE_LABEL)?.value,
  });
  const isCancelled = !isNil(game.cancelledAt);
  const endAt = plannedEndAt(game);
  const reviewFirst = isSessionEnded(game) && !isCancelled;

  const progressGroup = (
    <ManageGroup key="progress" title="세션 진행">
      {groups.progress.map((row) => (
        <ManageRow key={row.key} row={row} gameId={id} plannedEndAt={endAt} />
      ))}
    </ManageGroup>
  );
  const managementGroup = (
    <ManageGroup key="management" title="구인 관리">
      {groups.management.map((row) => (
        <ManageRow key={row.key} row={row} gameId={id} plannedEndAt={endAt} />
      ))}
      <CancelGameRow
        gameId={id}
        notifyCount={notifyCount}
        detail={cancelRowDetail({ game, notifyCount })}
        lockedReason={cancelRowLock({ game })}
      />
    </ManageGroup>
  );
  const reviewGroup = (
    <ManageGroup key="review" title="후기">
      {groups.review.map((row) => (
        <ManageRow key={row.key} row={row} gameId={id} plannedEndAt={endAt} />
      ))}
    </ManageGroup>
  );
  const groupNodes = reviewFirst
    ? [reviewGroup, progressGroup, managementGroup]
    : [progressGroup, managementGroup, reviewGroup];

  return (
    <PageShell appBar={<AppBar back={`/games/${id}`} title="운영 관리" />}>
      <div className={DESKTOP_CARD_CLASS}>
        <Container
          size="sm"
          className="flex flex-col gap-200 px-200 pt-200 pb-200 desktop:grid desktop:max-w-none desktop:grid-cols-[minmax(0,1fr)_320px] desktop:items-start desktop:p-200"
        >
          <div className="contents desktop:flex desktop:min-w-0 desktop:flex-col desktop:gap-200">
            <div className="order-1">
              <Card.Root padding="md" radius={600}>
                <HStack align="start" gap="100">
                  <Text
                    typography="heading3"
                    weight="extrabold"
                    render={<h2 />}
                    className="min-w-0 flex-1 truncate"
                  >
                    {game.title}
                  </Text>
                  <Badge colorPalette={MANAGE_STAGE_TONE[stage]}>{MANAGE_STAGE_LABEL[stage]}</Badge>
                </HStack>
                <HStack align="stretch" className="mt-150 border-t border-gray-200 pt-150">
                  {isNil(cancelNote) ? (
                    summaryStats.map((stat) => <ManageGameStat key={stat.label} stat={stat} />)
                  ) : (
                    <ManageCancelNote note={cancelNote} />
                  )}
                </HStack>
                {deadlineNote && <ManageDeadlineLine note={deadlineNote} />}
              </Card.Root>
            </div>
            <div className="order-3 flex flex-col gap-200">{groupNodes}</div>
          </div>

          <aside className="contents desktop:flex desktop:min-w-0 desktop:flex-col desktop:gap-150">
            {!isCancelled && (
              <div className="order-1 hidden desktop:block">
                <ManageTimeline steps={timeline} />
              </div>
            )}
            {canReopen && (
              <div className="order-2">
                <ManageReopenSection gameId={id} />
              </div>
            )}
          </aside>
        </Container>
      </div>
    </PageShell>
  );
}
