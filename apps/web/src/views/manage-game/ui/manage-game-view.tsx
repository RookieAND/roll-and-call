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
import { canReopenGame, ReopenGameLink } from "@/features/reopen-game";
import {
  getCurrentSessionUser,
  getGameById,
  getGameReviews,
  getResponseCounts,
  getCurrentServer,
} from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { cancelRowDetail } from "../model/cancel-row-detail";
import { cancelRowLock } from "../model/cancel-row-lock";
import { manageRows } from "../model/manage-rows";
import { manageSummary } from "../model/manage-summary";
import { ManageCancelNote } from "./manage-cancel-note";
import { ManageDeadlineLine } from "./manage-deadline-line";
import { ManageGameStat } from "./manage-game-stat";
import { ManageRow } from "./manage-row";

interface ManageGameViewProps {
  id: string;
}

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
      <>
        <AppBar back={`/games/${id}`} title="운영 관리" />
        <Container size="sm" className="py-300">
          <GmOnlyNotice
            gameId={id}
            signedIn={!!user}
            description="이 구인글의 운영 관리는 GM만 열 수 있습니다."
          />
        </Container>
      </>
    );
  }
  const responses = responseCounts.get(id) ?? 0;
  const notifyCount = gameCancelledRecipients({
    game,
    kind: GAME_CANCEL_KIND.gm,
    roster: game.participants,
  }).length;
  const { stage, stats, cancelNote, deadlineNote } = manageSummary({ game, responses });
  const canReopen = canReopenGame({ game, userId: user.id, serverId: server.id });
  const showNextSessionHint = isNil(game.cancelledAt) && isSessionEnded(game);
  const rows = manageRows({ game, reviewCount: reviews.length });

  return (
    <>
      <AppBar back={`/games/${id}`} title="운영 관리" />
      <Container size="sm" className="px-0">
        <div className="px-200 pt-200">
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
                stats.map((stat) => <ManageGameStat key={stat.label} stat={stat} />)
              ) : (
                <ManageCancelNote note={cancelNote} />
              )}
            </HStack>
            {deadlineNote && <ManageDeadlineLine note={deadlineNote} />}
            {canReopen && (
              <div className="mt-150">
                <ReopenGameLink gameId={id} variant="solid" />
              </div>
            )}
          </Card.Root>
        </div>

        <div className="p-200">
          <Card.Root
            radius={600}
            padding="none"
            className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-gray-200"
          >
            {rows.map((row) => (
              <ManageRow key={row.key} row={row} gameId={id} plannedEndAt={plannedEndAt(game)} />
            ))}
            <CancelGameRow
              gameId={id}
              notifyCount={notifyCount}
              detail={cancelRowDetail({ game, notifyCount })}
              lockedReason={cancelRowLock({ game })}
            />
          </Card.Root>
          {showNextSessionHint && (
            <Text typography="body4" foreground="hint" className="mt-150 px-100">
              다음 세션은 새 구인을 열고 참여자로 확정해 초대해 주세요
            </Text>
          )}
        </div>
      </Container>
    </>
  );
}
