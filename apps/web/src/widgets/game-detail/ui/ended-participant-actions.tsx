import { Button, VStack } from "@roll-and-call/ui";

import { formatDateWeekday } from "@/shared/lib";
import { ServerLink } from "@/shared/ui";

import { REVIEW_STATUS, type ReviewStatus } from "../model/review-status";
import { ActionNotice } from "./action-notice";
import { ActionPair } from "./action-pair";
import { ReviewsLink } from "./reviews-link";
import { SimilarGamesLink } from "./similar-games-link";

interface EndedParticipantActionsProps {
  gameId: string;
  endedOn: Date;
  attendanceConfirmed: boolean;
  review: ReviewStatus;
}

function reviewLines({
  attendanceConfirmed,
  writable,
  review,
}: {
  attendanceConfirmed: boolean;
  writable: boolean;
  review: ReviewStatus;
}) {
  if (!attendanceConfirmed) return ["GM이 출석을 확인하면 후기를 쓸 수 있습니다."];
  if (writable) return ["출석이 확정되었습니다.", "세션 후기를 남길 수 있습니다."];
  if (review === REVIEW_STATUS.written) {
    return ["후기를 남겼습니다.", "작성한 후기는 후기 보기에서 확인할 수 있습니다."];
  }
  return [];
}

export function EndedParticipantActions({
  gameId,
  endedOn,
  attendanceConfirmed,
  review,
}: EndedParticipantActionsProps) {
  const writable = attendanceConfirmed && review === REVIEW_STATUS.writable;
  const lines = reviewLines({ attendanceConfirmed, writable, review });

  return (
    <VStack gap="125">
      <ActionNotice title={`${formatDateWeekday(endedOn)}에 세션이 끝났습니다`} lines={lines} />
      <ActionPair>
        {writable ? (
          <Button
            render={<ServerLink path={`/games/${gameId}/review`} />}
            variant="tinted"
            size="lg"
          >
            후기 쓰기
          </Button>
        ) : (
          <ReviewsLink gameId={gameId} />
        )}
        <SimilarGamesLink size="lg" />
      </ActionPair>
    </VStack>
  );
}
