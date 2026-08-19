import Link from "next/link";
import { Button, HStack, Text, VStack } from "@trpg/ui";
import { canCoordinate, GAME_STATUS, type GameStatus } from "@/entities/game";
import type { GameDetailData } from "@/entities/game/api/queries";
import { LoginButton } from "@/features/auth";
import {
  DeleteGameButton,
  GameScheduleLink,
  JoinButton,
  joinGame,
  leaveGame,
} from "@/features/game";
import { formatDateTime } from "@/shared/lib/format";
import { StatusNotice } from "@/shared/ui/status-notice";

type Props = {
  game: GameDetailData;
  viewerId: string | null;
  isGm: boolean;
  hasJoined: boolean;
  status: GameStatus;
};

// Status/permission action zone. GM edit·delete are pinned to the very bottom,
// so they show regardless of status (모집중·마감·확정).
export function GameDetailActions({
  game,
  viewerId,
  isGm,
  hasJoined,
  status,
}: Props) {
  const canSchedule = canCoordinate({ scheduleMode: game.scheduleMode });
  const scheduleHref = `/games/${game.id}/schedule`;

  return (
    <>
      {(game.confirmedAt || !isGm) && (
        <div className="border-t border-gray-100 pt-4">
          {game.confirmedAt ? (
            <VStack gap={3}>
              <StatusNotice tone="success">
                <div className="text-xs font-bold text-success-700">세션 확정</div>
                <div className="mt-0.5 text-base font-extrabold text-success-800">
                  {formatDateTime(game.confirmedAt)}
                </div>
              </StatusNotice>
              {canSchedule && (
                <GameScheduleLink
                  gameId={game.id}
                  label="일정 조율 보기"
                  className="h-12 w-full text-sm"
                />
              )}
            </VStack>
          ) : status === GAME_STATUS.closed ? (
            <StatusNotice tone="muted">모집이 마감되었습니다</StatusNotice>
          ) : !viewerId ? (
            <VStack gap={3} className="items-center text-center">
              <Text size="sm" color="muted">
                참여하려면 로그인이 필요합니다.
              </Text>
              <LoginButton className="w-full" />
            </VStack>
          ) : hasJoined ? (
            // 참여 완료 → 주 CTA를 일정 조율로 전환, 참여 취소는 보조로 강등.
            <VStack gap={2}>
              {canSchedule && (
                <Button asChild size="lg" className="w-full gap-1.5">
                  <Link href={scheduleHref}>
                    일정 조율하기 <span>›</span>
                  </Link>
                </Button>
              )}
              <JoinButton
                gameId={game.id}
                action={leaveGame}
                label="참여 취소"
                variant="outline"
                successMessage="참여를 취소했습니다"
              />
            </VStack>
          ) : (
            <JoinButton
              gameId={game.id}
              action={joinGame}
              label="참여하기"
              successMessage="참여했습니다"
            />
          )}
        </div>
      )}

      {isGm && (
        <div className="border-t border-gray-100 pt-4">
          <VStack gap={2}>
            {canSchedule && !game.confirmedAt && (
              <GameScheduleLink
                gameId={game.id}
                label="일정 조율 현황"
                className="h-12 w-full text-sm"
              />
            )}
            <HStack gap={2}>
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/games/${game.id}/edit`}>수정</Link>
              </Button>
              <DeleteGameButton gameId={game.id} className="flex-1" />
            </HStack>
          </VStack>
        </div>
      )}
    </>
  );
}

